import path from 'path'
import { Probot, Context } from 'probot'
import { ROUTE_NAME } from './constants'
import { IRun, Runs } from './db-model'
import { log, shouldRun } from './util'
import { getConfig } from './config'

export function getDispatchEvents(context: Context, prefix: string) {
  const event = context.name
  const action = (context.payload as any).action
  const events: string[] = [`${prefix}.${event}`]

  if (action) {
    events.push(`${prefix}.${event}.${action}`)
  }

  return events
}

export async function getRegisterUrl(context: Context) {
  const registerURI = process.env.RSW_REGISTER_URI
  // eslint-disable-next-line no-console
  console.log('RSW_REGISTER_URI:', registerURI)
  if (registerURI) {
    return registerURI
  }
  const webhook = await context.octokit.apps.getWebhookConfigForApp()
  return path.join(webhook.data.url!, ROUTE_NAME, 'register')
}

export async function getAppWebhookUrl(context: Context) {
  const {
    data: { url },
  } = await context.octokit.apps.getWebhookConfigForApp()
  return url!
}

export async function getAppToken(app: Probot, context: Context) {
  const client = await app.auth()
  const {
    data: { token },
  } = await client.apps.createInstallationAccessToken({
    installation_id: (context.payload as any).installation.id,
  })

  const { data: appInfo } = await context.octokit.apps.getAuthenticated()

  return {
    appToken: token,
    appName: appInfo.slug || appInfo.name,
  }
}

export async function createOctokit(
  app: Probot,
  owner: string,
): Promise<Context['octokit']> {
  const client = await app.auth()
  const { data: appInfo } = await client.rest.apps.getAuthenticated()
  const installation =
    appInfo!.owner!.type === 'User'
      ? await client.apps.getUserInstallation({
          username: owner,
        })
      : await client.apps.getOrgInstallation({
          org: owner,
        })

  const octokit = await app.auth(installation.data.id)
  return octokit
}

export async function dispatchEvents(
  app: Probot,
  context: Context,
  inputs: Partial<IRun>,
) {
  const ctx = context as any as Context<'push'>
  const repo = ctx.payload.repository
  const owner = repo.owner
  const config = await getConfig(ctx)

  if (!shouldRun(repo.name, config.includes, config.excludes)) {
    return
  }

  log('config', JSON.stringify(config, null, 2))

  const callback = await getRegisterUrl(context)

  const data: Partial<IRun> = {
    ...inputs,
    callback,
    event: context.name,
    action: (context.payload as any).action || '',
    repo: {
      owner: owner.login,
      name: repo.name,
      full_name: repo.full_name,
    },
  }

  const run = new Runs({
    ...data,
    checks: [],
    config: {
      host_repo: config.repo,
    },
  })

  const { _id } = await run.save()

  const { appToken, appName } = await getAppToken(app, context)
  const events = getDispatchEvents(context, config.eventPrefix)
  // eslint-disable-next-line no-restricted-syntax
  for (const event of events) {
    context.log.info(`dispatch event: ${event}`)
    // eslint-disable-next-line no-await-in-loop
    await context.octokit.repos.createDispatchEvent({
      owner: owner.login,
      repo: config.repo,
      event_type: event,
      client_payload: {
        data,
        payload: JSON.stringify(context.payload),
        id: _id.toString(),
        app_name: appName,
        app_token: appToken,
        event_type: event,
      },
    })
  }
}

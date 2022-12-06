import path from 'path'
import { Probot, Context } from 'probot'
import { IRun, Runs } from '../db-model'
import { ROUTE_NAME } from '../constants'
import { getConfig } from '../config'
// import { shouldRun } from '../util'

export async function push(context: Context<'push'>, app: Probot) {
  const repo = context.payload.repository
  const owner = repo.owner
  const config = await getConfig(context)
  // if (!shouldRun(repo.name, config.excludes)) {
  //   return
  // }

  const sha = context.payload.after
  const webhook = await context.octokit.apps.getWebhookConfigForApp()
  const client = await app.auth()
  const {
    data: { token },
  } = await client.apps.createInstallationAccessToken({
    installation_id: context.payload.installation!.id,
  })

  const data: Partial<IRun> = {
    sha,
    callback_url: path.join(webhook.data.url!, ROUTE_NAME, 'register'),
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

  await context.octokit.repos.createDispatchEvent({
    owner: owner.login,
    repo: config.repo,
    event_type: config.eventType,
    client_payload: {
      ...data,
      token,
      id: _id.toString(),
      event: context.payload,
    },
  })
}

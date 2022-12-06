import { Probot, Context } from 'probot'
import { IRun, Runs } from '../db-model'
import { getConfig } from '../config'
import { shouldRun } from '../util'
import { getCallbackUrl, getAppToken } from '../octokit'

export async function push(context: Context<'push'>, app: Probot) {
  const repo = context.payload.repository
  const owner = repo.owner
  const config = await getConfig(context)

  if (!shouldRun(repo.name, config.excludes)) {
    return
  }

  const sha = context.payload.after
  const callback = await getCallbackUrl(context as any)

  const data: Partial<IRun> = {
    sha,
    callback,
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
  const { appToken, appName } = await getAppToken(app, context as any)

  await context.octokit.repos.createDispatchEvent({
    owner: owner.login,
    repo: config.repo,
    event_type: config.eventPrefix,
    client_payload: {
      ...data,
      id: _id.toString(),
      app_name: appName,
      app_token: appToken,
      event: context.payload,
    },
  })
}

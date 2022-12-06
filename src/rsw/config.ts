import { Context } from 'probot'
import { CONFIG_PATH, HOST_REPO, EVENT_TYPE } from './constants'

export interface Configuration {
  repo: string
  excludes: string[]
  eventType: string
}

const defaults: Configuration = {
  repo: HOST_REPO,
  eventType: EVENT_TYPE,
  excludes: [],
}

export async function getConfig(context: Context<'push'>) {
  const { config } = await context.octokit.config.get({
    owner: context.payload.repository.owner.login,
    repo: HOST_REPO,
    path: CONFIG_PATH,
    defaults: defaults as any,
  })
  return config as Configuration
}

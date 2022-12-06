import { Context } from 'probot'
import { CONFIG_PATH, HOST_REPO, EVENT_PREFIX } from './constants'

export interface Configuration {
  repo: string
  excludes: string[]
  eventPrefix: string
}

const defaults: Configuration = {
  repo: HOST_REPO,
  eventPrefix: EVENT_PREFIX,
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

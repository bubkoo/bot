import { Context } from 'probot'

export async function fetchConfig<T>(
  context: Context,
  defaults: T,
  filePath = 'apps/bot.yml',
) {
  return context.config(filePath, defaults).then((result) => result || defaults)
}

export interface Configuration {
  wip: boolean
  token: boolean
}

export const defaults: Configuration = {
  wip: true,
  token: true,
}

export async function getConfig(context: Context) {
  return fetchConfig(context, defaults).then((ret) => ret || defaults)
}

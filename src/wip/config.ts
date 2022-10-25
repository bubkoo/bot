import yaml from 'js-yaml'
import { getFileContent } from './util'
import { PullRequestContext, Section } from './types'

export const defaults: Section = {
  locations: ['title', 'label'],
  terms: ['wip', 'work in progress', '🚧'],
}

const configurationPath = './.github/apps/wip.yml'

export async function getConfig(context: PullRequestContext) {
  try {
    const content = await getFileContent(context, configurationPath)
    if (content) {
      const config = yaml.load(content) as Section | Section[]
      if (config) {
        const configs = Array.isArray(config) ? config : [config]
        const keys: (keyof Section)[] = ['terms', 'locations']
        configs.forEach((entry) => {
          keys.forEach((key) => {
            if (!entry[key]) {
              entry[key] = defaults[key] as any
            } else {
              if (!Array.isArray(entry[key])) {
                entry[key] = [entry[key] as any]
              }

              entry[key] = (entry[key] as any).map((item: any) => `${item}`)
            }
          })
        })

        context.log(
          `[wip] Use manual configuration: ${JSON.stringify([configs])}`,
        )

        return {
          configs,
          manual: true,
        }
      }
    }
  } catch (error) {
    // pass
  }

  context.log(`[wip] Use default configuration: ${JSON.stringify([defaults])}`)

  return {
    configs: [defaults],
  }
}

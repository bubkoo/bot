import { Context } from 'probot'
import { getConfig } from '../util'

export namespace Config {
  interface Actions {
    close?: boolean
    open?: boolean
    lock?: boolean
    unlock?: boolean
    lockReason?: string
    comment?: string | string[]
  }

  interface Definition {
    common?: { [label: string]: Actions }
    issues?: { [label: string]: Actions }
    pulls?: { [label: string]: Actions }
    only?: 'issues' | 'pulls'
  }

  export const defaults: { labelActions: Definition } = {
    labelActions: {
      common: {
        heated: {
          comment:
            `The thread has been temporarily locked.\n` + // tslint:disable-line
            `Please follow our community guidelines.`,
          lock: true,
          lockReason: 'too heated',
        },
        '-heated': { unlock: true },
      },
      issues: {
        feature: {
          close: true,
          comment:
            ':wave: @{{ author }}, please use our idea board to request new features.',
        },
        '-wontfix': {
          open: true,
        },
      },
      pulls: {
        pizzazz: {
          comment: '![](https://i.imgur.com/WuduJNk.jpg)',
        },
      },
    },
  }

  export async function get(context: Context) {
    return getConfig(context, defaults).then(
      (ret) => ret.labelActions || defaults.labelActions,
    )
  }

  export function getActions(
    config: Definition,
    type: 'issues' | 'pulls',
    label: string,
  ): Actions {
    const section = config[type]
    if (section && section[label]) {
      return section[label]
    }

    const common = config.common
    if (common) {
      return common[label] || {}
    }

    return {}
  }
}

import { Context } from 'probot'
import { getIssueTemplates, getPullRequestTemplate } from '../util'

export namespace Core {
  export async function isIssueBodyValid(context: Context, body: string) {
    if (!body || !body.trim()) {
      return false
    }

    const templates = await getIssueTemplates(context)
    console.log('issue templates: ', templates)
    for (const template of templates) {
      if (body.includes(template)) {
        return false
      }
    }

    return true
  }

  export async function isPullRequestBodyValid(context: Context, body: string) {
    if (!body || !body.trim()) {
      return false
    }

    const template = await getPullRequestTemplate(context)
    if (template && body.includes(template)) {
      return false
    }

    return true
  }
}

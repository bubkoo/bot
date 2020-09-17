import { Context } from 'probot'
import { random } from 'lodash'

export async function getConfig<T>(
  context: Context,
  defaults: T,
  filePath: string = 'config.yml',
) {
  return context.config(filePath, defaults).then((result) => result || defaults)
}

export function pickComment(comment: string | string[]) {
  if (typeof comment === 'string' || comment instanceof String) {
    return comment.toString()
  }

  const pos = random(0, comment.length, false)
  return comment[pos] || comment[0]
}

export async function getFileContent(context: Context, path: string) {
  try {
    const res = await context.github.repos.getContent(
      context.repo({
        path,
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
      }),
    )
    return Buffer.from(res.data.content, 'base64').toString()
  } catch (err) {
    return null
  }
}

export async function getDirSubPaths(
  context: Context,
  path: string,
): Promise<string[] | null> {
  try {
    const res = await context.github.repos.getContent(context.repo({ path }))
    context.log('getDirSubPaths: ', res.data)
    return (res.data as any).map((f: any) => f.path)
  } catch (err) {
    context.log(err)
    return null
  }
}

export async function getIssueTemplates(context: Context) {
  const defaultTemplate = await getFileContent(
    context,
    '.github/ISSUE_TEMPLATE.md',
  )

  context.log('defaultTemplate:', defaultTemplate)

  if (defaultTemplate != null) {
    return [defaultTemplate]
  }

  const paths = await getDirSubPaths(context, '.github/ISSUE_TEMPLATE/')
  context.log('issue template paths:', paths)
  if (paths !== null) {
    const templates = []
    for (const path of paths) {
      const template = await getFileContent(context, path)
      if (template != null) {
        templates.push(template)
      }
    }

    console.log('issue templates: ', templates)

    return templates
  }

  return []
}

export async function getPullRequestTemplate(context: Context) {
  return getFileContent(context, '.github/PULL_REQUEST_TEMPLATE.md')
}

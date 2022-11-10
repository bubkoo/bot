/* eslint-disable no-console */
import { Probot } from 'probot'
import { WorkflowRunContext } from './types'
import { createOrUpdateRepoSecret } from './util'

export async function requested(app: Probot, context: WorkflowRunContext) {
  console.log('workflow_run.requested')
  context.log.info('workflow_run.requested')
  const client = await app.auth()
  const {
    data: { token },
  } = await client.apps.createInstallationAccessToken({
    installation_id: context.payload.installation!.id,
  })

  await createOrUpdateRepoSecret(context, 'bot_token', token)

  console.log(token)
  context.log.info(token)
}

export async function completed(app: Probot, context: WorkflowRunContext) {
  context.log.info('workflow_run.completed')
  app.log.info(context.repo())
}

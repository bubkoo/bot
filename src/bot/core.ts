/* eslint-disable no-console */
import { Probot } from 'probot'
import { WorkflowRunContext } from './types'
import { createOrUpdateRepoSecret } from './util'

export async function run(app: Probot, context: WorkflowRunContext) {
  const payload = context.payload
  const action = payload.action

  console.log(`workflow_run.${action}`)

  if (action === 'requested') {
    console.log('===================== workflow started =====================')
    const client = await app.auth()
    const {
      data: { token },
    } = await client.apps.createInstallationAccessToken({
      installation_id: payload.installation!.id,
    })

    await createOrUpdateRepoSecret(context, 'app_token', token)

    console.log(token)
    context.log.info(token)
  } else if (action === 'completed') {
    console.log('==================== workflow completed ====================')
  }
}

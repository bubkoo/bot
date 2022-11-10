/* eslint-disable no-console */
import { Probot } from 'probot'
import { WorkflowRunContext } from './types'
import { createOrUpdateRepoSecret, deleteSecret } from './util'

export async function run(app: Probot, context: WorkflowRunContext) {
  const payload = context.payload
  const action = payload.action

  console.log(`==================== workflow ${action} ====================`)

  if (action === 'completed') {
    await deleteSecret(context, 'app_token')
  } else {
    const client = await app.auth()
    const {
      data: { token },
    } = await client.apps.createInstallationAccessToken({
      installation_id: payload.installation!.id,
    })

    await createOrUpdateRepoSecret(context, 'app_token', token)
  }
}

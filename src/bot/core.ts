import { Probot } from 'probot'
import { WorkflowRunContext } from './types'
import { createOrUpdateRepoSecret } from './util'

export async function run(app: Probot, context: WorkflowRunContext) {
  const payload = context.payload
  const action = payload.action
  const tokenName = process.env.APP_TOKEN_NAME || 'APP_TOKEN'

  // eslint-disable-next-line
  console.log(`=================== workflow_run ${action} ===================`)

  if (action === 'completed') {
    // await deleteSecret(context, tokenName)
  } else {
    const client = await app.auth()
    const {
      data: { token },
    } = await client.apps.createInstallationAccessToken({
      installation_id: payload.installation!.id,
    })

    // eslint-disable-next-line
    console.log(`=================== TOKEN UPDATED ===================`)
    await createOrUpdateRepoSecret(context, tokenName, token)
  }
}

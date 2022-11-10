import sodium from 'libsodium-wrappers'
import { WorkflowRunContext } from './types'

async function createSecret(context: WorkflowRunContext, value: string) {
  const { data } = await context.octokit.request(
    'GET /repos/:owner/:repo/actions/secrets/public-key',
    context.repo(),
  )

  await sodium.ready

  // Convert Secret & Base64 key to Uint8Array.
  const binkey = sodium.from_base64(data.key, sodium.base64_variants.ORIGINAL)
  const binsec = sodium.from_string(value)

  // Encrypt the secret using LibSodium
  const encryptedBytes = sodium.crypto_box_seal(binsec, binkey)

  return {
    key_id: data.key_id,
    // Base64 the encrypted secret
    encrypted_value: sodium.to_base64(
      encryptedBytes,
      sodium.base64_variants.ORIGINAL,
    ),
  }
}

export async function createOrUpdateRepoSecret(
  context: WorkflowRunContext,
  name: string,
  value: string,
) {
  const secret = await createSecret(context, value)
  await context.octokit.request(
    'PUT /repos/:owner/:repo/actions/secrets/:secret_name',
    context.repo({
      secret_name: name,
      data: secret,
    }),
  )
}

export async function deleteSecret(context: WorkflowRunContext, name: string) {
  await context.octokit.request(
    'DELETE /repos/:owner/:repo/actions/secrets/:secret_name',
    context.repo({
      secret_name: name,
    }),
  )
}

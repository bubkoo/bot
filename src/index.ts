import { Probot } from 'probot'
import { wip } from './wip'

export = (app: Probot) => {
  app.onAny(async (context: any) => {
    // eslint-disable-next-line no-console
    console.log(`event: ${context.name}`)

    // const appId = Number(core.getInput('app_id', { required }))
    // const privateKeyInput = core.getInput('private_key', { required })

    // if (appId == null || privateKeyInput == null) {
    //   return Promise.resolve(fallback)
    // }

    // const privateKey = isBase64(privateKeyInput)
    //   ? Buffer.from(privateKeyInput, 'base64').toString('utf8')
    //   : privateKeyInput

    const client = await app.auth()
    const installations = await client.paginate(client.apps.listInstallations)

    // context.log(context.payload as any)
    context.log((context.payload as any).installation)
    context.log(installations)

    const result = await client.apps.createInstallationAccessToken({
      installation_id: installations[0].id,
    })
    context.log(result.data.token)

    // // 1. Retrieve JSON Web Token (JWT) to authenticate as app
    // const { token: jwt } = await client.auth({ type: 'app' })

    // // 2. Get installationId of the app
    // const octokit = github.getOctokit(jwt)
    // const {
    //   data: { id: installationId },
    // } = await octokit.rest.apps.getRepoInstallation({
    //   ...github.context.repo,
    // })

    // // 3. Retrieve installation access token
    // const { token } = await client.auth({
    //   installationId,
    //   type: 'installation',
    // })
  })

  // app.on('workflow_run.requested', async (context) => {
  //   const auth = await app.auth()
  //   auth.config
  // })

  // app.on('workflow_run.completed', (context) => {})

  wip(app)
}

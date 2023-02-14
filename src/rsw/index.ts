import { Probot, ApplicationFunctionOptions } from 'probot'
import { fixRouter } from './util'
import { connectDB } from './db-connection'
import { ROUTE_NAME } from './constants'
import { rerun } from './handlers/rerun'
import { register } from './handlers/register'
import { complete } from './handlers/completed'
import { dispatchEvents } from './octokit'

export default async (app: Probot, options: ApplicationFunctionOptions) => {
  try {
    const getDBStatus = await connectDB()

    const router = options.getRouter!(fixRouter(ROUTE_NAME))
    router.get('/health', async (req, res) => {
      const { connection, state } = getDBStatus()
      const status = connection === 'up' && state === 'connected' ? 200 : 503
      res.status(status).json({
        ...getDBStatus(),
        sha: process.env.SHA_REF || 'unknown',
      })
    })

    router.get('/register', async (req, res) => register(req, res, app))

    app.on('push', async (context) =>
      dispatchEvents(app, context, {
        sha: context.payload.after,
        ref: context.payload.ref,
      }),
    )

    // app.on(['pull_request'], async (context) =>
    //   dispatchEvents(app, context, {
    //     sha: context.payload.pull_request.head.sha!,
    //     ref: context.payload.pull_request.head.ref,
    //   }),
    // )

    app.on('check_run.rerequested', async (context) => rerun(context))
    app.on('workflow_run.completed', async (context) => complete(context))
  } catch (error) {
    app.log.error(error)
  }
}

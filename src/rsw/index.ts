import { Probot, ApplicationFunctionOptions } from 'probot'
import { connectDB } from './db-connection'
import { ROUTE_NAME } from './constants'
import { push } from './handlers/push'
import { rerun } from './handlers/rerun'
import { register } from './handlers/register'
import { complete } from './handlers/completed'

export default async (app: Probot, options: ApplicationFunctionOptions) => {
  try {
    const getDBStatus = await connectDB()
    app.on('push', async (context) => push(context))
    app.on('check_run.rerequested', async (context) => rerun(context))
    app.on('workflow_run.completed', async (context) => complete(context))

    const router = options.getRouter!(ROUTE_NAME)

    router.get('/register', (req, res) => register(req, res, app))

    router.get('/health', (req, res) => {
      const { connection, state } = getDBStatus()
      const status = connection === 'up' && state === 'connected' ? 200 : 503
      res.status(status).json({
        ...getDBStatus(),
        sha: process.env.SHA_REF || 'unknown',
      })
    })
  } catch (error) {
    app.log.error(error)
  }
}

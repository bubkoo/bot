import { Probot } from 'probot'
import { requested, completed } from './core'

export function bot(app: Probot) {
  try {
    app.on('workflow_run.requested', async (context) => requested(app, context))
    app.on('workflow_run.completed', async (context) => completed(app, context))
  } catch (error) {
    app.log.error(error)
  }
}

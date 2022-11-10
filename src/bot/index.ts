import { Probot } from 'probot'
import { run } from './core'

export function bot(app: Probot) {
  try {
    app.on('workflow_run', async (context) => run(app, context))
  } catch (error) {
    app.log.error(error)
  }
}

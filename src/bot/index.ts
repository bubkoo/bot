import { Probot } from 'probot'
import { run } from './core'
import { WorkflowRunContext } from './types'

export function bot(app: Probot) {
  try {
    app.on('workflow_run', async (context) =>
      run(app, context as WorkflowRunContext),
    )
  } catch (error) {
    app.log.error(error)
  }
}

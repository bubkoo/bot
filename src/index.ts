import { Probot, Context } from 'probot'
import { wip } from './wip'

export = (app: Probot) => {
  app.on('*' as any, async (context: Context) => {
    context.log(`event: ${context.name}`)
  })

  wip(app)
}

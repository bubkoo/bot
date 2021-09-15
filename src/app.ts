import { Application, Context } from 'probot'
import { WIP } from './wip'

export = (app: Application) => {
  app.on('*', async (context: Context) => {
    context.log(`event: ${context.name}`)
  })

  WIP.start(app)
}

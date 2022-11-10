import { Probot } from 'probot'
import { bot } from './bot'
import { wip } from './wip'

export = (app: Probot) => {
  app.onAny(async (context: any) => {
    context.log.info(`event: ${context.name}`)
  })

  bot(app)
  wip(app)
}

import { Probot } from 'probot'
import { bot } from './bot'
import { wip } from './wip'

export = (app: Probot) => {
  app.onAny(async (context: any) => {
    // eslint-disable-next-line no-console
    console.log(`event: ${context.name}`)
    context.log.info(`event: ${context.name}`)
  })

  bot(app)
  wip(app)
}

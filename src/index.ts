import { Probot } from 'probot'
import bot from '@wow-actions/app-token'
import wip from './wip'

export = (app: Probot) => {
  app.onAny(async (context: any) => {
    // eslint-disable-next-line no-console
    console.log(`>>>>>>>>>> event: ${context.name} <<<<<<<<<<`)
  })

  bot(app)
  wip(app)
}

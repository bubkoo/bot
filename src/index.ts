import { Probot } from 'probot'
import { wip } from './wip'

export = (app: Probot) => {
  app.onAny((context) => {
    // eslint-disable-next-line no-console
    console.log(`event: ${context.name}`)
  })

  wip(app)
}

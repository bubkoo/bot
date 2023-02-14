import { Probot, ApplicationFunctionOptions } from 'probot'
import token from '@wow-actions/app-token'
import wip from './wip'
import rsw from './rsw'

export = async (app: Probot, options: ApplicationFunctionOptions) => {
  app.onAny(async (context: any) => {
    // eslint-disable-next-line no-console
    console.log(`event: ${context.name}`)
  })

  token(app)
  wip(app)
  rsw(app, options)
}

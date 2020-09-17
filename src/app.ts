import { Application } from 'probot'
import { Checker } from './checker'
import { Welcome } from './welcome'
import { AutoAssign } from './auto-assign'

export = (app: Application) => {
  app.on('issues.opened', async (context) => {
    const issueComment = context.issue({
      body: 'Thanks for opening this issue!',
    })
    await context.github.issues.createComment(issueComment)
  })

  Checker.start(app)
  Welcome.start(app)
  AutoAssign.start(app)
}

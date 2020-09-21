import { Application } from 'probot'
import { Checker } from './checker'
import { Welcome } from './welcome'
import { AutoAssign } from './auto-assign'
import { LabelActions } from './label-actions'

export = (app: Application) => {
  app.on('issues.opened', async (context) => {
    const issueComment = context.issue({
      body: 'Thanks for opening this issue!',
    })
    await context.github.issues.createComment(issueComment)
  })

  app.on(['issue_comment.created'], async (context) => {
    if (!context.isBot) {
      // await context.github.issues.deleteComment(
      //   context.issue({ comment_id: comment.id })
      // );

      await context.github.issues.createComment(
        context.issue({
          body: 'Welcome!!',
        }),
      )
    }
  })

  app.on('*', async (context) => {
    console.log(context.name)
  })

  Checker.start(app)
  Welcome.start(app)
  AutoAssign.start(app)
  LabelActions.start(app)
}

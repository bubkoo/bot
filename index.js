module.exports = (app) => {
  app.on('issues.opened', async (context) => {
    const issueComment = context.issue({
      body: 'Thanks for opening this issue!',
    })
    return context.github.issues.createComment(issueComment)
  })

  app.on('issue_comment.created', async (context) => {
    const issueComment = context.issue({
      body: 'issue commneted',
    })
    await context.github.issues.createComment(issueComment)
  })
}

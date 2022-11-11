import { Probot } from 'probot'
import { run } from './core'

export = (app: Probot) => {
  try {
    app.on(
      [
        'pull_request.opened',
        'pull_request.edited',
        'pull_request.labeled',
        'pull_request.unlabeled',
        'pull_request.synchronize',
      ],
      (context) => run(context),
    )
  } catch (error) {
    app.log.error(error)
  }
}

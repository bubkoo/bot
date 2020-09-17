import { Context } from 'probot'
import { getConfig } from '../util'

export namespace Config {
  export interface Definition {
    on: {
      issue: boolean
      pullRequest: boolean
    }
    checkIssueTemplate: boolean
    checkPullRequestTemplate: boolean
    excludeUsers: string[]
    badIssueTitles: string[]
    badPullRequestTitles: string[]
    labelToAdd?: string
    badIssueTitleComment: string | string[]
    badPullRequestTitleComment: string | string[]
    badIssueBodyComment: string | string[]
    badPullRequestBodyComment: string | string[]
    defaultComment: string | string[]
  }

  export const defaults: { checker: Definition } = {
    checker: {
      /**
       * Only warn about insufficient information on these events type.
       * Valid values are 'issue' and 'pullRequest'.
       */
      on: {
        issue: true,
        pullRequest: true,
      },
      /**
       * Require Issues to contain more information than what is provided in the
       * issue templates. Will fail if the issue's body is equal to a provided
       * template.
       */
      checkIssueTemplate: true,
      /**
       * Require Pull Requests to contain more information than what is provided
       * in the PR template. Will fail if the pull request's body is equal to the
       * provided template
       */
      checkPullRequestTemplate: true,
      /**
       * Add a list of people whose Issues/PRs will not be commented on.
       */
      excludeUsers: [''],
      /**
       * Default titles to check against for lack of descriptiveness.
       */
      badIssueTitles: ['update', 'updates', 'test', 'issue'],
      badPullRequestTitles: ['update', 'updates', 'test'],

      /**
       * Label to be added to Issues and Pull Requests with insufficient information given.
       */
      labelToAdd: 'needs-more-info',

      badIssueTitleComment: '',
      badPullRequestTitleComment: '',
      badIssueBodyComment: '',
      badPullRequestBodyComment: '',
      defaultComment:
        'The maintainers of this repository would appreciate it if you could provide more information.',
    },
  }
}

export namespace Config {
  export async function get(context: Context) {
    return getConfig(context, defaults).then(
      (ret) => ret.checker || defaults.checker,
    )
  }
}

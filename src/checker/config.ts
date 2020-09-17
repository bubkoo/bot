import { Context } from 'probot'
import { getConfig } from '../util'

export namespace Config {
  export interface Definition {
    /**
     * Only warn about insufficient information on these events type.
     * Valid values are 'issue' and 'pullRequest'.
     */
    on: {
      issue: boolean
      pullRequest: boolean
    }
    /**
     * Require Issues to contain more information than what is provided in the
     * issue templates. Will fail if the issue's body is equal to a provided
     * template.
     */
    checkIssueTemplate: boolean
    /**
     * Require Pull Requests to contain more information than what is provided
     * in the PR template. Will fail if the pull request's body is equal to the
     * provided template
     */
    checkPullRequestTemplate: boolean
    /**
     * Add a list of people whose Issues/PRs will not be commented on.
     */
    excludeUsers: string[]
    /**
     * Default issue titles to check against for lack of descriptiveness.
     */
    badIssueTitles: string[]
    /**
     * Default pull request titles to check against for lack of descriptiveness.
     */
    badPullRequestTitles: string[]
    /**
     * Label to be added to Issues and Pull Requests with insufficient information given.
     */
    labelToAdd?: string
    badIssueTitleComment: string | string[]
    badPullRequestTitleComment: string | string[]
    badIssueBodyComment: string | string[]
    badPullRequestBodyComment: string | string[]
    defaultComment: string | string[]
  }

  export const defaults: { checker: Definition } = {
    checker: {
      on: {
        issue: true,
        pullRequest: true,
      },
      checkIssueTemplate: true,
      checkPullRequestTemplate: true,
      excludeUsers: [],
      badIssueTitles: ['update', 'updates', 'test', 'issue', 'debug', 'demo'],
      badPullRequestTitles: ['update', 'updates', 'test'],
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

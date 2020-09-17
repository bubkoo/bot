import { Context } from 'probot';
export declare namespace Config {
    interface Definition {
        on: {
            issue: boolean;
            pullRequest: boolean;
        };
        checkIssueTemplate: boolean;
        checkPullRequestTemplate: boolean;
        excludeUsers: string[];
        badIssueTitles: string[];
        badPullRequestTitles: string[];
        labelToAdd?: string;
        badIssueTitleComment: string | string[];
        badPullRequestTitleComment: string | string[];
        badIssueBodyComment: string | string[];
        badPullRequestBodyComment: string | string[];
        defaultComment: string | string[];
    }
    const defaults: {
        checker: Definition;
    };
}
export declare namespace Config {
    function get(context: Context): Promise<Definition>;
}

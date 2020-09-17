import { Context } from 'probot';
export declare namespace Core {
    function isIssueBodyValid(context: Context, body: string): Promise<boolean>;
    function isPullRequestBodyValid(context: Context, body: string): Promise<boolean>;
}

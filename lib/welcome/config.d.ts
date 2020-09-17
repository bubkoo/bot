import { Context } from 'probot';
export declare namespace Config {
    interface Definition {
        firstIssueComment: string | string[];
        firstPRComment: string | string[];
        firstPRMergeComment: string | string[];
    }
    const defaults: {
        welcome: Definition;
    };
    function get(context: Context): Promise<Definition>;
}

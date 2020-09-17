import { Context } from 'probot';
export declare namespace Config {
    interface Definition {
        addReviewers: boolean;
        addAssignees: boolean;
        reviewers: string[];
        assignees: string[];
        numberOfAssignees: number;
        numberOfReviewers: number;
        skipKeywords: string[];
        useReviewGroups: boolean;
        useAssigneeGroups: boolean;
        reviewGroups: {
            [key: string]: string[];
        };
        assigneeGroups: {
            [key: string]: string[];
        };
    }
    const defaults: {
        autoAssign: Definition;
    };
    function get(context: Context): Promise<Definition>;
}

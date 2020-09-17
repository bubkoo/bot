import { Config } from './config';
export declare function hasSkipKeywords(title: string, skipKeywords: string[]): boolean;
export declare function chooseReviewers(owner: string, config: Config.Definition): {
    reviewers: string[];
    team_reviewers: string[];
};
export declare function chooseAssignees(owner: string, config: Config.Definition): string[];

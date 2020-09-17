import { Context } from 'probot';
export declare function getConfig<T>(context: Context, defaults: T, filePath?: string): Promise<T>;
export declare function pickComment(comment: string | string[]): string;
export declare function getFileContent(context: Context, path: string): Promise<string | null>;
export declare function getDirSubPaths(context: Context, path: string): Promise<any>;
export declare function getIssueTemplates(context: Context): Promise<string[]>;
export declare function getPullRequestTemplate(context: Context): Promise<string | null>;

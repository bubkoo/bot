"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chooseAssignees = exports.chooseReviewers = exports.hasSkipKeywords = void 0;
var lodash_1 = require("lodash");
function hasSkipKeywords(title, skipKeywords) {
    for (var _i = 0, skipKeywords_1 = skipKeywords; _i < skipKeywords_1.length; _i++) {
        var skipKeyword = skipKeywords_1[_i];
        if (title.toLowerCase().includes(skipKeyword.toLowerCase())) {
            return true;
        }
    }
    return false;
}
exports.hasSkipKeywords = hasSkipKeywords;
function chooseUsers(candidates, count, filterUser) {
    if (filterUser === void 0) { filterUser = ''; }
    var _a = candidates.reduce(function (acc, reviewer) {
        var separator = '/';
        var isTeam = reviewer.includes(separator);
        if (isTeam) {
            var team = reviewer.split(separator)[1];
            acc.teams = __spreadArrays(acc.teams, [team]);
        }
        else if (reviewer !== filterUser) {
            acc.users = __spreadArrays(acc.users, [reviewer]);
        }
        return acc;
    }, {
        teams: [],
        users: [],
    }), teams = _a.teams, users = _a.users;
    // all-assign
    if (count === 0) {
        return {
            teams: teams,
            users: users,
        };
    }
    return {
        teams: teams,
        users: lodash_1.sampleSize(users, count),
    };
}
function chooseUsersFromGroups(owner, groups, desiredNumber) {
    var users = [];
    for (var group in groups) {
        users = users.concat(chooseUsers(groups[group], desiredNumber, owner).users);
    }
    return users;
}
function chooseReviewers(owner, config) {
    var useReviewGroups = config.useReviewGroups, reviewGroups = config.reviewGroups, numberOfReviewers = config.numberOfReviewers, reviewers = config.reviewers;
    var useGroups = useReviewGroups && Object.keys(reviewGroups).length > 0;
    if (useGroups) {
        var chosenReviewers_1 = chooseUsersFromGroups(owner, reviewGroups, numberOfReviewers);
        return {
            reviewers: chosenReviewers_1,
            team_reviewers: [],
        };
    }
    var chosenReviewers = chooseUsers(reviewers, numberOfReviewers, owner);
    return {
        reviewers: chosenReviewers.users,
        team_reviewers: chosenReviewers.teams,
    };
}
exports.chooseReviewers = chooseReviewers;
function chooseAssignees(owner, config) {
    var useAssigneeGroups = config.useAssigneeGroups, assigneeGroups = config.assigneeGroups, addAssignees = config.addAssignees, numberOfAssignees = config.numberOfAssignees, numberOfReviewers = config.numberOfReviewers, assignees = config.assignees, reviewers = config.reviewers;
    var chosenAssignees = [];
    var useGroups = useAssigneeGroups && Object.keys(assigneeGroups).length > 0;
    if (typeof addAssignees === 'string') {
        if (addAssignees !== 'author') {
            throw new Error("Error in configuration file to do with using addAssignees. Expected 'addAssignees' variable to be either boolean or 'author'");
        }
        chosenAssignees = [owner];
    }
    else if (useGroups) {
        chosenAssignees = chooseUsersFromGroups(owner, assigneeGroups, numberOfAssignees || numberOfReviewers);
    }
    else {
        var candidates = assignees ? assignees : reviewers;
        chosenAssignees = chooseUsers(candidates, numberOfAssignees || numberOfReviewers, owner).users;
    }
    return chosenAssignees;
}
exports.chooseAssignees = chooseAssignees;
//# sourceMappingURL=util.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checker = void 0;
var util_1 = require("../util");
var config_1 = require("./config");
var core_1 = require("./core");
var Checker;
(function (Checker) {
    function start(app) {
        var _this = this;
        app.on(['pull_request.opened', 'issues.opened'], function (context) { return __awaiter(_this, void 0, void 0, function () {
            var title, body, user, badBody, badTitle, eventType, pr, issue, config, ignoreUser, _a, _b, comment, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        badBody = false;
                        badTitle = false;
                        if (context.payload.pull_request) {
                            pr = context.payload.pull_request;
                            user = pr.user;
                            title = pr.title;
                            body = pr.body;
                            eventType = 'pullRequest';
                        }
                        else {
                            issue = context.payload.issue;
                            user = issue.user;
                            title = issue.title;
                            body = issue.body;
                            eventType = 'issue';
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 10, , 11]);
                        return [4 /*yield*/, config_1.Config.get(context)];
                    case 2:
                        config = _c.sent();
                        if (!config.on[eventType]) {
                            return [2 /*return*/];
                        }
                        ignoreUser = false;
                        if (config.excludeUsers) {
                            if (config.excludeUsers.includes(user.login)) {
                                ignoreUser = true;
                            }
                        }
                        if (!!ignoreUser) return [3 /*break*/, 9];
                        if (config.badIssueTitles && eventType === 'issue') {
                            if (config.badIssueTitles.includes(title.toLowerCase())) {
                                badTitle = true;
                            }
                        }
                        if (config.badPullRequestTitles && eventType === 'pullRequest') {
                            if (config.badPullRequestTitles.includes(title.toLowerCase())) {
                                badTitle = true;
                            }
                        }
                        badBody = !body || !body.trim();
                        if (!!badBody) return [3 /*break*/, 8];
                        if (!(eventType === 'pullRequest')) return [3 /*break*/, 5];
                        _a = config.checkPullRequestTemplate;
                        if (!_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, core_1.Core.isPullRequestBodyValid(context, body)];
                    case 3:
                        _a = !(_c.sent());
                        _c.label = 4;
                    case 4:
                        if (_a) {
                            badBody = true;
                        }
                        return [3 /*break*/, 8];
                    case 5:
                        if (!(eventType === 'issue')) return [3 /*break*/, 8];
                        _b = config.checkIssueTemplate;
                        if (!_b) return [3 /*break*/, 7];
                        return [4 /*yield*/, core_1.Core.isIssueBodyValid(context, body)];
                    case 6:
                        _b = !(_c.sent());
                        _c.label = 7;
                    case 7:
                        if (_b) {
                            badBody = true;
                        }
                        _c.label = 8;
                    case 8:
                        if (badTitle || badBody) {
                            comment = void 0;
                            if (badTitle) {
                                comment =
                                    eventType === 'issue'
                                        ? config.badIssueTitleComment || config.defaultComment
                                        : config.badPullRequestTitleComment || config.defaultComment;
                            }
                            else {
                                comment =
                                    eventType === 'issue'
                                        ? config.badIssueBodyComment || config.defaultComment
                                        : config.badPullRequestBodyComment || config.defaultComment;
                            }
                            context.github.issues.createComment(context.issue({ body: util_1.pickComment(comment) }));
                            // Add label if there is one listed in the yaml file
                            if (config.labelToAdd) {
                                context.github.issues.addLabels(context.issue({ labels: [config.labelToAdd] }));
                            }
                        }
                        _c.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        err_1 = _c.sent();
                        if (err_1.code !== 404) {
                            throw err_1;
                        }
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        }); });
    }
    Checker.start = start;
})(Checker = exports.Checker || (exports.Checker = {}));
//# sourceMappingURL=index.js.map
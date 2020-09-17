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
exports.Core = void 0;
var config_1 = require("./config");
var util_1 = require("../util");
var Core;
(function (Core) {
    function firstIssue(app) {
        var _this = this;
        app.on('issues.opened', function (context) { return __awaiter(_this, void 0, void 0, function () {
            var response, countIssue, config, comment, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, context.github.issues.listForRepo(context.repo({
                            state: 'all',
                            creator: context.payload.issue.user.login,
                        }))];
                    case 1:
                        response = _a.sent();
                        countIssue = response.data.filter(function (data) { return !data.pull_request; });
                        if (!(countIssue.length === 1)) return [3 /*break*/, 5];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, config_1.Config.get(context)];
                    case 3:
                        config = _a.sent();
                        comment = config.firstIssueComment;
                        if (comment) {
                            context.github.issues.createComment(context.issue({ body: util_1.pickComment(comment) }));
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        if (err_1.code !== 404) {
                            throw err_1;
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    }
    Core.firstIssue = firstIssue;
    function firstPr(app) {
        var _this = this;
        app.on('pull_request.opened', function (context) { return __awaiter(_this, void 0, void 0, function () {
            var response, countPR, config, comment, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, context.github.issues.listForRepo(context.repo({
                            state: 'all',
                            creator: context.payload.pull_request.user.login,
                        }))];
                    case 1:
                        response = _a.sent();
                        countPR = response.data.filter(function (data) { return data.pull_request; });
                        if (!(countPR.length === 1)) return [3 /*break*/, 5];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, config_1.Config.get(context)];
                    case 3:
                        config = _a.sent();
                        comment = config.firstPRComment;
                        if (comment) {
                            context.github.issues.createComment(context.issue({ body: util_1.pickComment(comment) }));
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        if (error_1.code !== 404) {
                            throw error_1;
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    }
    Core.firstPr = firstPr;
    function firstMerge(app) {
        var _this = this;
        app.on('pull_request.closed', function (context) { return __awaiter(_this, void 0, void 0, function () {
            var creator, _a, owner, repo, res, mergedPRs, config, comment, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!context.payload.pull_request.merged) return [3 /*break*/, 5];
                        creator = context.payload.pull_request.user.login;
                        _a = context.repo(), owner = _a.owner, repo = _a.repo;
                        return [4 /*yield*/, context.github.search.issuesAndPullRequests({
                                q: "is:pr is:merged author:" + creator + " repo:" + owner + "/" + repo,
                            })];
                    case 1:
                        res = _b.sent();
                        mergedPRs = res.data.items.filter(function (pr) { return pr.number !== context.payload.pull_request.number; });
                        if (!(mergedPRs.length === 0)) return [3 /*break*/, 5];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, config_1.Config.get(context)];
                    case 3:
                        config = _b.sent();
                        comment = config.firstPRMergeComment;
                        if (comment) {
                            context.github.issues.createComment(context.issue({ body: util_1.pickComment(comment) }));
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        err_2 = _b.sent();
                        if (err_2.code !== 404) {
                            throw err_2;
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    }
    Core.firstMerge = firstMerge;
})(Core = exports.Core || (exports.Core = {}));
//# sourceMappingURL=core.js.map
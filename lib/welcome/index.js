"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Welcome = void 0;
var core_1 = require("./core");
var Welcome;
(function (Welcome) {
    function start(app) {
        core_1.Core.firstIssue(app);
        core_1.Core.firstPr(app);
        core_1.Core.firstMerge(app);
    }
    Welcome.start = start;
})(Welcome = exports.Welcome || (exports.Welcome = {}));
//# sourceMappingURL=index.js.map
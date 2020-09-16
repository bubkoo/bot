"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var probot_1 = require("probot");
var app_1 = __importDefault(require("./app"));
probot_1.Probot.run(app_1.default);
//# sourceMappingURL=index.js.map
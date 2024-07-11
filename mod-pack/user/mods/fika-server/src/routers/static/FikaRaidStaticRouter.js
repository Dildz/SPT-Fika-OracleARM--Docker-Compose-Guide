"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FikaRaidStaticRouter = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const Router_1 = require("/snapshot/project/obj/di/Router");
const FikaRaidCallbacks_1 = require("../../callbacks/FikaRaidCallbacks");
let FikaRaidStaticRouter = class FikaRaidStaticRouter extends Router_1.StaticRouter {
    fikaRaidCallbacks;
    constructor(fikaRaidCallbacks) {
        super([
            new Router_1.RouteAction("/fika/raid/create", async (url, info, sessionID, _output) => {
                return this.fikaRaidCallbacks.handleRaidCreate(url, info, sessionID);
            }),
            new Router_1.RouteAction("/fika/raid/join", async (url, info, sessionID, _output) => {
                return this.fikaRaidCallbacks.handleRaidJoin(url, info, sessionID);
            }),
            new Router_1.RouteAction("/fika/raid/leave", async (url, info, sessionID, _output) => {
                return this.fikaRaidCallbacks.handleRaidLeave(url, info, sessionID);
            }),
            new Router_1.RouteAction("/fika/raid/gethost", async (url, info, sessionID, _output) => {
                return this.fikaRaidCallbacks.handleRaidGethost(url, info, sessionID);
            }),
            new Router_1.RouteAction("/fika/raid/spawnpoint", async (url, info, sessionID, _output) => {
                return this.fikaRaidCallbacks.handleRaidSpawnpoint(url, info, sessionID);
            }),
            new Router_1.RouteAction("/fika/raid/getsettings", async (url, info, sessionID, _output) => {
                return this.fikaRaidCallbacks.handleRaidGetSettings(url, info, sessionID);
            }),
        ]);
        this.fikaRaidCallbacks = fikaRaidCallbacks;
    }
};
exports.FikaRaidStaticRouter = FikaRaidStaticRouter;
exports.FikaRaidStaticRouter = FikaRaidStaticRouter = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaRaidCallbacks")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaRaidCallbacks_1.FikaRaidCallbacks !== "undefined" && FikaRaidCallbacks_1.FikaRaidCallbacks) === "function" ? _a : Object])
], FikaRaidStaticRouter);
//# sourceMappingURL=FikaRaidStaticRouter.js.map
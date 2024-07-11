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
exports.FikaClientStaticRouter = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const Router_1 = require("/snapshot/project/obj/di/Router");
const FikaClientCallbacks_1 = require("../../callbacks/FikaClientCallbacks");
let FikaClientStaticRouter = class FikaClientStaticRouter extends Router_1.StaticRouter {
    fikaClientCallbacks;
    constructor(fikaClientCallbacks) {
        super([
            new Router_1.RouteAction("/fika/client/config", async (url, info, sessionID, _output) => {
                return this.fikaClientCallbacks.handleClientConfig(url, info, sessionID);
            }),
            new Router_1.RouteAction("/fika/natpunchserver/config", async (url, info, sessionID, _output) => {
                return this.fikaClientCallbacks.handleNatPunchServerConfig(url, info, sessionID);
            }),
            new Router_1.RouteAction("/fika/client/check/mods", async (url, info, sessionID, _output) => {
                return this.fikaClientCallbacks.handleCheckMods(url, info, sessionID);
            }),
            new Router_1.RouteAction("/fika/profile/download", async (url, info, sessionID, _output) => {
                return this.fikaClientCallbacks.handleProfileDownload(url, info, sessionID);
            }),
        ]);
        this.fikaClientCallbacks = fikaClientCallbacks;
    }
};
exports.FikaClientStaticRouter = FikaClientStaticRouter;
exports.FikaClientStaticRouter = FikaClientStaticRouter = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaClientCallbacks")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaClientCallbacks_1.FikaClientCallbacks !== "undefined" && FikaClientCallbacks_1.FikaClientCallbacks) === "function" ? _a : Object])
], FikaClientStaticRouter);
//# sourceMappingURL=FikaClientStaticRouter.js.map
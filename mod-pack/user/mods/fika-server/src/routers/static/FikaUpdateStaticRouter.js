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
exports.FikaUpdateStaticRouter = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const Router_1 = require("/snapshot/project/obj/di/Router");
const FikaUpdateCallbacks_1 = require("../../callbacks/FikaUpdateCallbacks");
let FikaUpdateStaticRouter = class FikaUpdateStaticRouter extends Router_1.StaticRouter {
    fikaUpdateCallbacks;
    constructor(fikaUpdateCallbacks) {
        super([
            new Router_1.RouteAction("/fika/update/ping", async (url, info, sessionID, _output) => {
                return this.fikaUpdateCallbacks.handlePing(url, info, sessionID);
            }),
            new Router_1.RouteAction("/fika/update/spawnpoint", async (url, info, sessionID, _output) => {
                return this.fikaUpdateCallbacks.handleSpawnpoint(url, info, sessionID);
            }),
            new Router_1.RouteAction("/fika/update/playerspawn", async (url, info, sessionID, _output) => {
                return this.fikaUpdateCallbacks.handlePlayerspawn(url, info, sessionID);
            }),
            new Router_1.RouteAction("/fika/update/sethost", async (url, info, sessionID, _output) => {
                return this.fikaUpdateCallbacks.handleSethost(url, info, sessionID);
            }),
            new Router_1.RouteAction("/fika/update/setstatus", async (url, info, sessionID, _output) => {
                return this.fikaUpdateCallbacks.handleSetStatus(url, info, sessionID);
            }),
        ]);
        this.fikaUpdateCallbacks = fikaUpdateCallbacks;
    }
};
exports.FikaUpdateStaticRouter = FikaUpdateStaticRouter;
exports.FikaUpdateStaticRouter = FikaUpdateStaticRouter = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaUpdateCallbacks")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaUpdateCallbacks_1.FikaUpdateCallbacks !== "undefined" && FikaUpdateCallbacks_1.FikaUpdateCallbacks) === "function" ? _a : Object])
], FikaUpdateStaticRouter);
//# sourceMappingURL=FikaUpdateStaticRouter.js.map
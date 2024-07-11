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
exports.FikaLocationStaticRouter = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const Router_1 = require("/snapshot/project/obj/di/Router");
const FikaLocationCallbacks_1 = require("../../callbacks/FikaLocationCallbacks");
let FikaLocationStaticRouter = class FikaLocationStaticRouter extends Router_1.StaticRouter {
    fikaLocationCallbacks;
    constructor(fikaLocationCallbacks) {
        super([
            new Router_1.RouteAction("/fika/location/raids", async (url, info, sessionID, _output) => {
                return this.fikaLocationCallbacks.handleGetRaids(url, info, sessionID);
            }),
        ]);
        this.fikaLocationCallbacks = fikaLocationCallbacks;
    }
};
exports.FikaLocationStaticRouter = FikaLocationStaticRouter;
exports.FikaLocationStaticRouter = FikaLocationStaticRouter = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaLocationCallbacks")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaLocationCallbacks_1.FikaLocationCallbacks !== "undefined" && FikaLocationCallbacks_1.FikaLocationCallbacks) === "function" ? _a : Object])
], FikaLocationStaticRouter);
//# sourceMappingURL=FikaLocationStaticRouter.js.map
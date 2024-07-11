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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FikaRaidCallbacks = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const HttpResponseUtil_1 = require("/snapshot/project/obj/utils/HttpResponseUtil");
const FikaRaidController_1 = require("../controllers/FikaRaidController");
let FikaRaidCallbacks = class FikaRaidCallbacks {
    httpResponseUtil;
    fikaRaidController;
    constructor(httpResponseUtil, fikaRaidController) {
        this.httpResponseUtil = httpResponseUtil;
        this.fikaRaidController = fikaRaidController;
        // empty
    }
    /** Handle /fika/raid/create */
    handleRaidCreate(_url, info, _sessionID) {
        return this.httpResponseUtil.noBody(this.fikaRaidController.handleRaidCreate(info));
    }
    /** Handle /fika/raid/join */
    handleRaidJoin(_url, info, _sessionID) {
        return this.httpResponseUtil.noBody(this.fikaRaidController.handleRaidJoin(info));
    }
    /** Handle /fika/raid/leave */
    handleRaidLeave(_url, info, _sessionID) {
        this.fikaRaidController.handleRaidLeave(info);
        return this.httpResponseUtil.nullResponse();
    }
    /** Handle /fika/raid/gethost */
    handleRaidGethost(_url, info, _sessionID) {
        return this.httpResponseUtil.noBody(this.fikaRaidController.handleRaidGethost(info));
    }
    /** Handle /fika/raid/spawnpoint */
    handleRaidSpawnpoint(_url, info, _sessionID) {
        return this.httpResponseUtil.noBody(this.fikaRaidController.handleRaidSpawnpoint(info));
    }
    /** Handle /fika/raid/getsettings */
    handleRaidGetSettings(_url, info, _sessionID) {
        return this.httpResponseUtil.noBody(this.fikaRaidController.handleRaidGetSettings(info));
    }
};
exports.FikaRaidCallbacks = FikaRaidCallbacks;
exports.FikaRaidCallbacks = FikaRaidCallbacks = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("HttpResponseUtil")),
    __param(1, (0, tsyringe_1.inject)("FikaRaidController")),
    __metadata("design:paramtypes", [typeof (_a = typeof HttpResponseUtil_1.HttpResponseUtil !== "undefined" && HttpResponseUtil_1.HttpResponseUtil) === "function" ? _a : Object, typeof (_b = typeof FikaRaidController_1.FikaRaidController !== "undefined" && FikaRaidController_1.FikaRaidController) === "function" ? _b : Object])
], FikaRaidCallbacks);
//# sourceMappingURL=FikaRaidCallbacks.js.map
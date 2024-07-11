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
exports.FikaUpdateController = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const FikaMatchService_1 = require("../services/FikaMatchService");
let FikaUpdateController = class FikaUpdateController {
    fikaMatchService;
    constructor(fikaMatchService) {
        this.fikaMatchService = fikaMatchService;
        // empty
    }
    /**
     * Handle /fika/update/ping
     * @param request
     */
    handlePing(request) {
        this.fikaMatchService.resetTimeout(request.serverId);
    }
    /**
     * Handle /fika/update/spawnpoint
     * @param request
     */
    handleSpawnpoint(request) {
        this.fikaMatchService.setMatchSpawnPoint(request.serverId, request.name);
    }
    /**
     * Handle /fika/update/playerspawn
     * @param request
     */
    handlePlayerspawn(request) {
        this.fikaMatchService.setPlayerGroup(request.serverId, request.profileId, request.groupId);
    }
    /**
     * Handle /fika/update/sethost
     * @param request
     */
    handleSethost(request) {
        this.fikaMatchService.setMatchHost(request.serverId, request.ips, request.port, request.natPunch);
    }
    /**
     * Handle /fika/update/setstatus
     * @param request
     */
    handleSetStatus(request) {
        this.fikaMatchService.setMatchStatus(request.serverId, request.status);
    }
};
exports.FikaUpdateController = FikaUpdateController;
exports.FikaUpdateController = FikaUpdateController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaMatchService")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaMatchService_1.FikaMatchService !== "undefined" && FikaMatchService_1.FikaMatchService) === "function" ? _a : Object])
], FikaUpdateController);
//# sourceMappingURL=FikaUpdateController.js.map
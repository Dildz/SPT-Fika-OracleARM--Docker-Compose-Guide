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
exports.FikaRaidController = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const FikaMatchEndSessionMessages_1 = require("../models/enums/FikaMatchEndSessionMessages");
const FikaMatchService_1 = require("../services/FikaMatchService");
let FikaRaidController = class FikaRaidController {
    fikaMatchService;
    constructor(fikaMatchService) {
        this.fikaMatchService = fikaMatchService;
        // empty
    }
    /**
     * Handle /fika/raid/create
     * @param request
     */
    handleRaidCreate(request) {
        return {
            success: this.fikaMatchService.createMatch(request),
        };
    }
    /**
     * Handle /fika/raid/join
     * @param request
     */
    handleRaidJoin(request) {
        this.fikaMatchService.addPlayerToMatch(request.serverId, request.profileId, { groupId: null, isDead: false });
        const match = this.fikaMatchService.getMatch(request.serverId);
        return {
            serverId: request.serverId,
            timestamp: match.timestamp,
            expectedNumberOfPlayers: match.expectedNumberOfPlayers,
            gameVersion: match.gameVersion,
            fikaVersion: match.fikaVersion,
            raidCode: match.raidCode
        };
    }
    /**
     * Handle /fika/raid/leave
     * @param request
     */
    handleRaidLeave(request) {
        if (request.serverId === request.profileId) {
            this.fikaMatchService.endMatch(request.serverId, FikaMatchEndSessionMessages_1.FikaMatchEndSessionMessage.HOST_SHUTDOWN_MESSAGE);
            return;
        }
        this.fikaMatchService.removePlayerFromMatch(request.serverId, request.profileId);
    }
    /**
     * Handle /fika/raid/gethost
     * @param request
     */
    handleRaidGethost(request) {
        const match = this.fikaMatchService.getMatch(request.serverId);
        if (!match) {
            return;
        }
        return {
            ips: match.ips,
            port: match.port,
            natPunch: match.natPunch,
        };
    }
    /**
     * Handle /fika/raid/spawnpoint
     * @param request
     */
    handleRaidSpawnpoint(request) {
        const match = this.fikaMatchService.getMatch(request.serverId);
        if (!match) {
            return;
        }
        return {
            spawnpoint: match.spawnPoint,
        };
    }
    /**
     * Handle /fika/raid/getsettings
     * @param request
     */
    handleRaidGetSettings(request) {
        const match = this.fikaMatchService.getMatch(request.serverId);
        if (!match) {
            return;
        }
        return {
            metabolismDisabled: match.raidConfig.metabolismDisabled,
            playersSpawnPlace: match.raidConfig.playersSpawnPlace
        };
    }
};
exports.FikaRaidController = FikaRaidController;
exports.FikaRaidController = FikaRaidController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaMatchService")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaMatchService_1.FikaMatchService !== "undefined" && FikaMatchService_1.FikaMatchService) === "function" ? _a : Object])
], FikaRaidController);
//# sourceMappingURL=FikaRaidController.js.map
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
exports.FikaLocationController = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const FikaMatchService_1 = require("../services/FikaMatchService");
let FikaLocationController = class FikaLocationController {
    fikaMatchService;
    constructor(fikaMatchService) {
        this.fikaMatchService = fikaMatchService;
        // empty
    }
    /**
     * Handle /fika/location/raids
     * @param request
     * @returns
     */
    handleGetRaids(_request) {
        const matches = [];
        for (const [matchId, match] of this.fikaMatchService.getAllMatches()) {
            matches.push({
                serverId: matchId,
                hostUsername: match.hostUsername,
                playerCount: match.players.size,
                status: match.status,
                location: match.raidConfig.location,
                side: match.side,
                time: match.time,
            });
        }
        return matches;
    }
};
exports.FikaLocationController = FikaLocationController;
exports.FikaLocationController = FikaLocationController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaMatchService")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaMatchService_1.FikaMatchService !== "undefined" && FikaMatchService_1.FikaMatchService) === "function" ? _a : Object])
], FikaLocationController);
//# sourceMappingURL=FikaLocationController.js.map
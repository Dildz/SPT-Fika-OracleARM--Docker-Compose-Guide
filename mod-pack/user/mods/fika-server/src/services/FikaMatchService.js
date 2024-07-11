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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FikaMatchService = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const LocationController_1 = require("/snapshot/project/obj/controllers/LocationController");
const ILogger_1 = require("/snapshot/project/obj/models/spt/utils/ILogger");
const SaveServer_1 = require("/snapshot/project/obj/servers/SaveServer");
const FikaMatchEndSessionMessages_1 = require("../models/enums/FikaMatchEndSessionMessages");
const FikaMatchStatus_1 = require("../models/enums/FikaMatchStatus");
const FikaConfig_1 = require("../utils/FikaConfig");
let FikaMatchService = class FikaMatchService {
    logger;
    locationController;
    saveServer;
    fikaConfig;
    matches;
    timeoutIntervals;
    constructor(logger, locationController, saveServer, fikaConfig) {
        this.logger = logger;
        this.locationController = locationController;
        this.saveServer = saveServer;
        this.fikaConfig = fikaConfig;
        this.matches = new Map();
        this.timeoutIntervals = new Map();
    }
    /**
     * Adds a timeout interval for the given match
     * @param matchId
     */
    addTimeoutInterval(matchId) {
        const fikaConfig = this.fikaConfig.getConfig();
        if (this.timeoutIntervals.has(matchId)) {
            this.removeTimeoutInterval(matchId);
        }
        this.timeoutIntervals.set(matchId, setInterval(() => {
            const match = this.getMatch(matchId);
            match.timeout++;
            // if it timed out 'sessionTimeout' times or more, end the match
            if (match.timeout >= fikaConfig.server.sessionTimeout) {
                this.endMatch(matchId, FikaMatchEndSessionMessages_1.FikaMatchEndSessionMessage.PING_TIMEOUT_MESSAGE);
            }
        }, 60 * 1000));
    }
    /**
     * Removes the timeout interval for the given match
     * @param matchId
     * @returns
     */
    removeTimeoutInterval(matchId) {
        if (!this.timeoutIntervals.has(matchId)) {
            return;
        }
        clearInterval(this.timeoutIntervals.get(matchId));
        this.timeoutIntervals.delete(matchId);
    }
    /**
     * Returns the match with the given id, undefined if match does not exist
     * @param matchId
     * @returns
     */
    getMatch(matchId) {
        if (!this.matches.has(matchId)) {
            return;
        }
        return this.matches.get(matchId);
    }
    /**
     * Returns all matches
     * @returns
     */
    getAllMatches() {
        return this.matches;
    }
    /**
     * Returns all match ids
     * @returns
     */
    getAllMatchIds() {
        return Array.from(this.matches.keys());
    }
    /**
     * Returns the player with the given id in the given match, undefined if either match or player does not exist
     * @param matchId
     * @param playerId
     * @returns
     */
    getPlayerInMatch(matchId, playerId) {
        if (!this.matches.has(matchId)) {
            return;
        }
        if (!this.matches.get(matchId).players.has(playerId)) {
            return;
        }
        return this.matches.get(matchId).players.get(playerId);
    }
    /**
     * Returns an array with all playerIds in the given match, undefined if match does not exist
     *
     * Note:
     * - host player is the one where playerId is equal to matchId
     * @param matchId
     * @returns
     */
    getPlayersIdsByMatch(matchId) {
        if (!this.matches.has(matchId)) {
            return;
        }
        return Array.from(this.matches.get(matchId).players.keys());
    }
    /**
     * Returns the match id that has a player with the given player id, undefined if the player isn't in a match
     *
     * @param playerId
     * @returns
     */
    getMatchIdByPlayer(playerId) {
        for (const [key, value] of this.matches.entries()) {
            if (value.players.has(playerId)) {
                return key;
            }
        }
        return undefined;
    }
    /**
     * Returns the match id that has a player with the given session id, undefined if the player isn't in a match
     *
     * Note:
     * - First tries to find pmc, then scav
     * @param sessionId
     * @returns
     */
    getMatchIdByProfile(sessionId) {
        const profile = this.saveServer.getProfile(sessionId);
        // check if pmc is in match
        let matchId = this.getMatchIdByPlayer(profile.characters.pmc._id);
        if (matchId === undefined) {
            // check if scav is in match
            matchId = this.getMatchIdByPlayer(profile.characters.scav._id);
        }
        return matchId;
    }
    /**
     * Creates a new coop match
     * @param data
     * @returns
     */
    createMatch(data) {
        if (this.matches.has(data.serverId)) {
            this.deleteMatch(data.serverId);
        }
        const locationData = this.locationController.get(data.serverId, {
            crc: 0 /* unused */,
            locationId: data.settings.location,
            variantId: 0 /* unused */,
        });
        this.matches.set(data.serverId, {
            ips: null,
            port: null,
            hostUsername: data.hostUsername,
            timestamp: data.timestamp,
            expectedNumberOfPlayers: data.expectedNumberOfPlayers,
            raidConfig: data.settings,
            locationData: locationData,
            status: FikaMatchStatus_1.FikaMatchStatus.LOADING,
            spawnPoint: null,
            timeout: 0,
            players: new Map(),
            gameVersion: data.gameVersion,
            fikaVersion: data.fikaVersion,
            side: data.side,
            time: data.time,
            raidCode: data.raidCode,
            natPunch: false
        });
        this.addTimeoutInterval(data.serverId);
        this.addPlayerToMatch(data.serverId, data.serverId, { groupId: null, isDead: false });
        return this.matches.has(data.serverId) && this.timeoutIntervals.has(data.serverId);
    }
    /**
     * Deletes a coop match and removes the timeout interval
     * @param matchId
     */
    deleteMatch(matchId) {
        if (!this.matches.has(matchId)) {
            return;
        }
        this.matches.delete(matchId);
        this.removeTimeoutInterval(matchId);
    }
    /**
     * Ends the given match, logs a reason and removes the timeout interval
     * @param matchId
     * @param reason
     */
    endMatch(matchId, reason) {
        this.logger.info(`Coop session ${matchId} has ended: ${reason}`);
        this.deleteMatch(matchId);
    }
    /**
     * Updates the status of the given match
     * @param matchId
     * @param status
     */
    setMatchStatus(matchId, status) {
        if (!this.matches.has(matchId)) {
            return;
        }
        this.matches.get(matchId).status = status;
    }
    /**
     * Sets the spawn point of the given match
     * @param matchId
     * @param spawnPoint
     */
    setMatchSpawnPoint(matchId, spawnPoint) {
        if (!this.matches.has(matchId)) {
            return;
        }
        this.matches.get(matchId).spawnPoint = spawnPoint;
    }
    /**
     * Sets the ip and port for the given match
     * @param matchId
     * @param ips
     * @param port
     */
    setMatchHost(matchId, ips, port, natPunch) {
        if (!this.matches.has(matchId)) {
            return;
        }
        const match = this.matches.get(matchId);
        match.ips = ips;
        match.port = port;
        match.natPunch = natPunch;
    }
    /**
     * Resets the timeout of the given match
     * @param matchId
     */
    resetTimeout(matchId) {
        if (!this.matches.has(matchId)) {
            return;
        }
        this.matches.get(matchId).timeout = 0;
    }
    /**
     * Adds a player to a match
     * @param matchId
     * @param playerId
     * @param data
     */
    addPlayerToMatch(matchId, playerId, data) {
        if (!this.matches.has(matchId)) {
            return;
        }
        this.matches.get(matchId).players.set(playerId, data);
    }
    /**
     * Sets the groupId for a player
     * @param matchId
     * @param playerId
     * @param groupId
     */
    setPlayerGroup(matchId, playerId, groupId) {
        if (!this.matches.has(matchId)) {
            return;
        }
        if (!this.matches.get(matchId).players.has(playerId)) {
            return;
        }
        this.matches.get(matchId).players.get(playerId).groupId = groupId;
    }
    /**
     * Removes a player from a match
     * @param matchId
     * @param playerId
     */
    removePlayerFromMatch(matchId, playerId) {
        if (!this.matches.has(matchId)) {
            return;
        }
        this.matches.get(matchId).players.delete(playerId);
    }
};
exports.FikaMatchService = FikaMatchService;
exports.FikaMatchService = FikaMatchService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("LocationController")),
    __param(2, (0, tsyringe_1.inject)("SaveServer")),
    __param(3, (0, tsyringe_1.inject)("FikaConfig")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof LocationController_1.LocationController !== "undefined" && LocationController_1.LocationController) === "function" ? _b : Object, typeof (_c = typeof SaveServer_1.SaveServer !== "undefined" && SaveServer_1.SaveServer) === "function" ? _c : Object, typeof (_d = typeof FikaConfig_1.FikaConfig !== "undefined" && FikaConfig_1.FikaConfig) === "function" ? _d : Object])
], FikaMatchService);
//# sourceMappingURL=FikaMatchService.js.map
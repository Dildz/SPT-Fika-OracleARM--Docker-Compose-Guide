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
exports.FikaPlayerRelationsHelper = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const FikaPlayerRelationsCacheService_1 = require("../services/cache/FikaPlayerRelationsCacheService");
let FikaPlayerRelationsHelper = class FikaPlayerRelationsHelper {
    fikaPlayerRelationsCacheService;
    constructor(fikaPlayerRelationsCacheService) {
        this.fikaPlayerRelationsCacheService = fikaPlayerRelationsCacheService;
        // empty
    }
    /**
     * Returns the friendlist from the given player
     * @param profileId
     * @returns
     */
    getFriendsList(profileId) {
        return this.fikaPlayerRelationsCacheService.getStoredValue(profileId).Friends;
    }
    /**
     * Returns the ignorelist from the given player
     * @param profileId
     * @returns
     */
    getIgnoreList(profileId) {
        return this.fikaPlayerRelationsCacheService.getStoredValue(profileId).Ignore;
    }
    /**
     * Returns a list of players ignoring the given player
     * @param profileId
     * @returns
     */
    getInIgnoreList(profileId) {
        const storedPlayers = this.fikaPlayerRelationsCacheService.getKeys();
        return storedPlayers.filter((player) => this.fikaPlayerRelationsCacheService.getStoredValue(player).Ignore.includes(profileId));
    }
    /**
     * Makes 2 players fwends :D
     * @param fromProfileId
     * @param toProfileId
     */
    addFriend(fromProfileId, toProfileId) {
        const playerRelations1 = this.fikaPlayerRelationsCacheService.getStoredValue(fromProfileId);
        if (!playerRelations1.Friends.includes(toProfileId)) {
            playerRelations1.Friends.push(toProfileId);
            this.fikaPlayerRelationsCacheService.storeValue(fromProfileId, playerRelations1);
        }
        const playerRelations2 = this.fikaPlayerRelationsCacheService.getStoredValue(toProfileId);
        if (!playerRelations2.Friends.includes(fromProfileId)) {
            playerRelations2.Friends.push(fromProfileId);
            this.fikaPlayerRelationsCacheService.storeValue(toProfileId, playerRelations2);
        }
    }
    /**
     * If the 2 players are fwends, it makes them not fwends :(
     * @param fromProfileId
     * @param toProfileId
     */
    removeFriend(fromProfileId, toProfileId) {
        const playerRelations1 = this.fikaPlayerRelationsCacheService.getStoredValue(fromProfileId);
        if (playerRelations1.Friends.includes(toProfileId)) {
            playerRelations1.Friends.splice(playerRelations1.Friends.indexOf(toProfileId), 1);
            this.fikaPlayerRelationsCacheService.storeValue(fromProfileId, playerRelations1);
        }
        const playerRelations2 = this.fikaPlayerRelationsCacheService.getStoredValue(toProfileId);
        if (playerRelations2.Friends.includes(fromProfileId)) {
            playerRelations2.Friends.splice(playerRelations2.Friends.indexOf(fromProfileId), 1);
            this.fikaPlayerRelationsCacheService.storeValue(toProfileId, playerRelations2);
        }
    }
    /**
     * If player2 is not in player1's ignore list, it adds them
     * @param fromProfileId
     * @param toProfileId
     */
    addToIgnoreList(fromProfileId, toProfileId) {
        const playerRelations = this.fikaPlayerRelationsCacheService.getStoredValue(fromProfileId);
        if (!playerRelations.Ignore.includes(toProfileId)) {
            playerRelations.Ignore.push(toProfileId);
            this.fikaPlayerRelationsCacheService.storeValue(fromProfileId, playerRelations);
        }
    }
    /**
     * If player2 is in player1's ignore list, it removes them
     * @param fromProfileId
     * @param toProfileId
     */
    removeFromIgnoreList(fromProfileId, toProfileId) {
        const playerRelations = this.fikaPlayerRelationsCacheService.getStoredValue(fromProfileId);
        if (playerRelations.Ignore.includes(toProfileId)) {
            playerRelations.Ignore.splice(playerRelations.Ignore.indexOf(toProfileId), 1);
            this.fikaPlayerRelationsCacheService.storeValue(fromProfileId, playerRelations);
        }
    }
};
exports.FikaPlayerRelationsHelper = FikaPlayerRelationsHelper;
exports.FikaPlayerRelationsHelper = FikaPlayerRelationsHelper = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaPlayerRelationsCacheService")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaPlayerRelationsCacheService_1.FikaPlayerRelationsCacheService !== "undefined" && FikaPlayerRelationsCacheService_1.FikaPlayerRelationsCacheService) === "function" ? _a : Object])
], FikaPlayerRelationsHelper);
//# sourceMappingURL=FikaPlayerRelationsHelper.js.map
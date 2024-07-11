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
exports.FikaFriendRequestsHelper = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const HashUtil_1 = require("/snapshot/project/obj/utils/HashUtil");
const FikaFriendRequestsCacheService_1 = require("../services/cache/FikaFriendRequestsCacheService");
let FikaFriendRequestsHelper = class FikaFriendRequestsHelper {
    hashUtil;
    fikaFriendRequestsCacheService;
    constructor(hashUtil, fikaFriendRequestsCacheService) {
        this.hashUtil = hashUtil;
        this.fikaFriendRequestsCacheService = fikaFriendRequestsCacheService;
        // empty
    }
    /**
     * Returns the friend requests that were sent to the given player
     * @param profileId
     * @returns
     */
    getReceivedFriendRequests(profileId) {
        return this.fikaFriendRequestsCacheService.getReceivedFriendRequests(profileId);
    }
    /**
     * Returns the friend requests that were sent by the given player
     * @param profileId
     * @returns
     */
    getSentFriendRequests(profileId) {
        return this.fikaFriendRequestsCacheService.getSentFriendRequests(profileId);
    }
    /**
     * Adds a friend request
     * @param fromProfileId
     * @param toProfileId
     */
    addFriendRequest(fromProfileId, toProfileId) {
        if (this.fikaFriendRequestsCacheService.exists(fromProfileId, toProfileId)) {
            return;
        }
        this.fikaFriendRequestsCacheService.storeFriendRequest({
            _id: this.hashUtil.generate(),
            from: fromProfileId,
            to: toProfileId,
            date: Math.round(Date.now() / 1000),
        });
    }
    /**
     * Removes a friend request
     * @param fromProfileId
     * @param toProfileId
     */
    removeFriendRequest(fromProfileId, toProfileId) {
        if (!this.fikaFriendRequestsCacheService.exists(fromProfileId, toProfileId)) {
            return;
        }
        this.fikaFriendRequestsCacheService.deleteFriendRequest(fromProfileId, toProfileId);
    }
};
exports.FikaFriendRequestsHelper = FikaFriendRequestsHelper;
exports.FikaFriendRequestsHelper = FikaFriendRequestsHelper = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("HashUtil")),
    __param(1, (0, tsyringe_1.inject)("FikaFriendRequestsCacheService")),
    __metadata("design:paramtypes", [typeof (_a = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _a : Object, typeof (_b = typeof FikaFriendRequestsCacheService_1.FikaFriendRequestsCacheService !== "undefined" && FikaFriendRequestsCacheService_1.FikaFriendRequestsCacheService) === "function" ? _b : Object])
], FikaFriendRequestsHelper);
//# sourceMappingURL=FikaFriendRequestsHelper.js.map
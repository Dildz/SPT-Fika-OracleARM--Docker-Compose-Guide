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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FikaFriendRequestsCacheService = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const JsonUtil_1 = require("/snapshot/project/obj/utils/JsonUtil");
const VFS_1 = require("/snapshot/project/obj/utils/VFS");
const FikaConfig_1 = require("../../utils/FikaConfig");
let FikaFriendRequestsCacheService = class FikaFriendRequestsCacheService {
    jsonUtil;
    vfs;
    fikaConfig;
    friendRequests;
    friendRequestsFullPath;
    friendRequestsPath = "cache/friendRequests.json";
    constructor(jsonUtil, vfs, fikaConfig) {
        this.jsonUtil = jsonUtil;
        this.vfs = vfs;
        this.fikaConfig = fikaConfig;
        this.friendRequestsFullPath = `./${this.fikaConfig.getModPath()}${this.friendRequestsPath}`;
        if (!this.vfs.exists(this.friendRequestsFullPath)) {
            this.vfs.writeFile(this.friendRequestsFullPath, "[]");
        }
        this.friendRequests = this.jsonUtil.deserialize(this.vfs.readFile(this.friendRequestsFullPath), this.friendRequestsFullPath);
    }
    getAllFriendRequests() {
        return this.friendRequests;
    }
    getSentFriendRequests(profileId) {
        return this.friendRequests.filter((request) => request.from === profileId);
    }
    getReceivedFriendRequests(profileId) {
        return this.friendRequests.filter((request) => request.to === profileId);
    }
    exists(from, to) {
        return !!this.friendRequests.find((request) => request.from === from && request.to === to);
    }
    deleteFriendRequest(from, to) {
        const index = this.friendRequests.findIndex((request) => request.from === from && request.to === to);
        if (index === -1) {
            return;
        }
        this.friendRequests.splice(index, 1);
        this.vfs.writeFile(this.friendRequestsFullPath, this.jsonUtil.serialize(this.friendRequests));
    }
    storeFriendRequest(value) {
        this.friendRequests.push(value);
        this.vfs.writeFile(this.friendRequestsFullPath, this.jsonUtil.serialize(this.friendRequests));
    }
};
exports.FikaFriendRequestsCacheService = FikaFriendRequestsCacheService;
exports.FikaFriendRequestsCacheService = FikaFriendRequestsCacheService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("JsonUtil")),
    __param(1, (0, tsyringe_1.inject)("VFS")),
    __param(2, (0, tsyringe_1.inject)("FikaConfig")),
    __metadata("design:paramtypes", [typeof (_a = typeof JsonUtil_1.JsonUtil !== "undefined" && JsonUtil_1.JsonUtil) === "function" ? _a : Object, typeof (_b = typeof VFS_1.VFS !== "undefined" && VFS_1.VFS) === "function" ? _b : Object, typeof (_c = typeof FikaConfig_1.FikaConfig !== "undefined" && FikaConfig_1.FikaConfig) === "function" ? _c : Object])
], FikaFriendRequestsCacheService);
//# sourceMappingURL=FikaFriendRequestsCacheService.js.map
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
exports.FikaPlayerRelationsCacheService = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const ProfileHelper_1 = require("/snapshot/project/obj/helpers/ProfileHelper");
const JsonUtil_1 = require("/snapshot/project/obj/utils/JsonUtil");
const VFS_1 = require("/snapshot/project/obj/utils/VFS");
const FikaConfig_1 = require("../../utils/FikaConfig");
let FikaPlayerRelationsCacheService = class FikaPlayerRelationsCacheService {
    profileHelper;
    jsonUtil;
    vfs;
    fikaConfig;
    playerRelations;
    playerRelationsFullPath;
    playerRelationsPath = "cache/playerRelations.json";
    constructor(profileHelper, jsonUtil, vfs, fikaConfig) {
        this.profileHelper = profileHelper;
        this.jsonUtil = jsonUtil;
        this.vfs = vfs;
        this.fikaConfig = fikaConfig;
        this.playerRelationsFullPath = `./${this.fikaConfig.getModPath()}${this.playerRelationsPath}`;
        if (!this.vfs.exists(this.playerRelationsFullPath)) {
            this.vfs.writeFile(this.playerRelationsFullPath, "{}");
        }
        this.playerRelations = this.jsonUtil.deserialize(this.vfs.readFile(this.playerRelationsFullPath), this.playerRelationsFullPath);
        const profiles = this.profileHelper.getProfiles();
        for (const profileId of Object.keys(profiles)) {
            if (!this.playerRelations[profileId]) {
                this.storeValue(profileId, {
                    Friends: [],
                    Ignore: [],
                });
            }
        }
    }
    getKeys() {
        return Object.keys(this.playerRelations);
    }
    getStoredValue(key) {
        if (!this.playerRelations[key]) {
            this.storeValue(key, {
                Friends: [],
                Ignore: [],
            });
        }
        return this.playerRelations[key];
    }
    storeValue(key, value) {
        this.playerRelations[key] = value;
        this.vfs.writeFile(this.playerRelationsFullPath, this.jsonUtil.serialize(this.playerRelations));
    }
};
exports.FikaPlayerRelationsCacheService = FikaPlayerRelationsCacheService;
exports.FikaPlayerRelationsCacheService = FikaPlayerRelationsCacheService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(1, (0, tsyringe_1.inject)("JsonUtil")),
    __param(2, (0, tsyringe_1.inject)("VFS")),
    __param(3, (0, tsyringe_1.inject)("FikaConfig")),
    __metadata("design:paramtypes", [typeof (_a = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _a : Object, typeof (_b = typeof JsonUtil_1.JsonUtil !== "undefined" && JsonUtil_1.JsonUtil) === "function" ? _b : Object, typeof (_c = typeof VFS_1.VFS !== "undefined" && VFS_1.VFS) === "function" ? _c : Object, typeof (_d = typeof FikaConfig_1.FikaConfig !== "undefined" && FikaConfig_1.FikaConfig) === "function" ? _d : Object])
], FikaPlayerRelationsCacheService);
//# sourceMappingURL=FikaPlayerRelationsCacheService.js.map
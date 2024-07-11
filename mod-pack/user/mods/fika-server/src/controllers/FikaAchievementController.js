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
exports.FikaAchievementController = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const SaveServer_1 = require("/snapshot/project/obj/servers/SaveServer");
const DatabaseService_1 = require("/snapshot/project/obj/services/DatabaseService");
let FikaAchievementController = class FikaAchievementController {
    saveServer;
    databaseService;
    constructor(saveServer, databaseService) {
        this.saveServer = saveServer;
        this.databaseService = databaseService;
        // empty
    }
    getAchievementStatistics(sessionID) {
        const achievements = this.databaseService.getAchievements();
        const stats = {};
        const profiles = Object.values(this.saveServer.getProfiles());
        for (const achievement of achievements) {
            let percentage = 0;
            for (const profile of profiles) {
                if (!(profile.characters?.pmc?.Achievements)) {
                    continue;
                }
                if (!(achievement.id in profile.characters.pmc.Achievements)) {
                    continue;
                }
                percentage++;
            }
            percentage = (percentage / profiles.length) * 100;
            stats[achievement.id] = percentage;
        }
        return { elements: stats };
    }
};
exports.FikaAchievementController = FikaAchievementController;
exports.FikaAchievementController = FikaAchievementController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("SaveServer")),
    __param(1, (0, tsyringe_1.inject)("DatabaseService")),
    __metadata("design:paramtypes", [typeof (_a = typeof SaveServer_1.SaveServer !== "undefined" && SaveServer_1.SaveServer) === "function" ? _a : Object, typeof (_b = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _b : Object])
], FikaAchievementController);
//# sourceMappingURL=FikaAchievementController.js.map
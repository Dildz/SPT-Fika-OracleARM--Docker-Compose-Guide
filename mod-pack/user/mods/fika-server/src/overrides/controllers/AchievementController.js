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
exports.AchievementControllerOverride = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const FikaAchievementController_1 = require("../../controllers/FikaAchievementController");
const Override_1 = require("../../di/Override");
let AchievementControllerOverride = class AchievementControllerOverride extends Override_1.Override {
    fikaAchievementController;
    constructor(fikaAchievementController) {
        super();
        this.fikaAchievementController = fikaAchievementController;
    }
    execute(container) {
        container.afterResolution("AchievementController", (_t, result) => {
            result.getAchievementStatistics = (sessionID) => {
                return this.fikaAchievementController.getAchievementStatistics(sessionID);
            };
        }, { frequency: "Always" });
    }
};
exports.AchievementControllerOverride = AchievementControllerOverride;
exports.AchievementControllerOverride = AchievementControllerOverride = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaAchievementController")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaAchievementController_1.FikaAchievementController !== "undefined" && FikaAchievementController_1.FikaAchievementController) === "function" ? _a : Object])
], AchievementControllerOverride);
//# sourceMappingURL=AchievementController.js.map
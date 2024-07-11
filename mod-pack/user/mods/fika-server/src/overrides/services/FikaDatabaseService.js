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
exports.DatabaseServiceOverride = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const Override_1 = require("../../di/Override");
const FikaConfig_1 = require("../../utils/FikaConfig");
const LocalisationService_1 = require("/snapshot/project/obj/services/LocalisationService");
const DatabaseServer_1 = require("/snapshot/project/obj/servers/DatabaseServer");
let DatabaseServiceOverride = class DatabaseServiceOverride extends Override_1.Override {
    databaseServer;
    localisationService;
    fikaConfig;
    constructor(databaseServer, localisationService, fikaConfig) {
        super();
        this.databaseServer = databaseServer;
        this.localisationService = localisationService;
        this.fikaConfig = fikaConfig;
    }
    execute(container) {
        container.afterResolution("DatabaseService", (_t, result) => {
            result.getProfiles = () => {
                const config = this.fikaConfig.getConfig().server;
                if (!this.databaseServer.getTables().templates.profiles) {
                    throw new Error(this.localisationService.getText("database-data_at_path_missing", "assets/database/templates/profiles.json"));
                }
                let templates = this.databaseServer.getTables().templates.profiles;
                if (!config.showDevProfile) {
                    delete templates["SPT Developer"];
                }
                if (!config.showNonStandardProfile) {
                    for (const id of ["Tournament", "SPT Easy start", "SPT Zero to hero"]) {
                        delete templates[id];
                    }
                }
                return templates;
            };
        }, { frequency: "Always" });
    }
};
exports.DatabaseServiceOverride = DatabaseServiceOverride;
exports.DatabaseServiceOverride = DatabaseServiceOverride = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("DatabaseServer")),
    __param(1, (0, tsyringe_1.inject)("LocalisationService")),
    __param(2, (0, tsyringe_1.inject)("FikaConfig")),
    __metadata("design:paramtypes", [typeof (_a = typeof DatabaseServer_1.DatabaseServer !== "undefined" && DatabaseServer_1.DatabaseServer) === "function" ? _a : Object, typeof (_b = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _b : Object, typeof (_c = typeof FikaConfig_1.FikaConfig !== "undefined" && FikaConfig_1.FikaConfig) === "function" ? _c : Object])
], DatabaseServiceOverride);
//# sourceMappingURL=FikaDatabaseService.js.map
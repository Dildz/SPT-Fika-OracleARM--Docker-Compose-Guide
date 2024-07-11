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
exports.Fika = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const DatabaseServer_1 = require("/snapshot/project/obj/servers/DatabaseServer");
const Overrider_1 = require("./overrides/Overrider");
const FikaServerTools_1 = require("./utils/FikaServerTools");
const FikaConfig_1 = require("./utils/FikaConfig");
let Fika = class Fika {
    databaseServer;
    overrider;
    fikaServerTools;
    fikaConfig;
    natPunchServerConfig;
    constructor(databaseServer, overrider, fikaServerTools, fikaConfig) {
        this.databaseServer = databaseServer;
        this.overrider = overrider;
        this.fikaServerTools = fikaServerTools;
        this.fikaConfig = fikaConfig;
        this.natPunchServerConfig = fikaConfig.getConfig().natPunchServer;
    }
    async preSptLoad(container) {
        await this.overrider.override(container);
    }
    async postSptLoad(container) {
        if (this.natPunchServerConfig.enable) {
            this.fikaServerTools.startService("NatPunchServer");
        }
    }
};
exports.Fika = Fika;
exports.Fika = Fika = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("DatabaseServer")),
    __param(1, (0, tsyringe_1.inject)("Overrider")),
    __param(2, (0, tsyringe_1.inject)("FikaServerTools")),
    __param(3, (0, tsyringe_1.inject)("FikaConfig")),
    __metadata("design:paramtypes", [typeof (_a = typeof DatabaseServer_1.DatabaseServer !== "undefined" && DatabaseServer_1.DatabaseServer) === "function" ? _a : Object, typeof (_b = typeof Overrider_1.Overrider !== "undefined" && Overrider_1.Overrider) === "function" ? _b : Object, typeof (_c = typeof FikaServerTools_1.FikaServerTools !== "undefined" && FikaServerTools_1.FikaServerTools) === "function" ? _c : Object, typeof (_d = typeof FikaConfig_1.FikaConfig !== "undefined" && FikaConfig_1.FikaConfig) === "function" ? _d : Object])
], Fika);
//# sourceMappingURL=Fika.js.map
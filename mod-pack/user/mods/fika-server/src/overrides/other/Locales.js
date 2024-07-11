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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalesOverride = void 0;
const node_path_1 = __importDefault(require("node:path"));
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const DatabaseServer_1 = require("/snapshot/project/obj/servers/DatabaseServer");
const ImporterUtil_1 = require("/snapshot/project/obj/utils/ImporterUtil");
const Override_1 = require("../../di/Override");
const FikaConfig_1 = require("../../utils/FikaConfig");
let LocalesOverride = class LocalesOverride extends Override_1.Override {
    databaseServer;
    importerUtil;
    fikaConfig;
    constructor(databaseServer, importerUtil, fikaConfig) {
        super();
        this.databaseServer = databaseServer;
        this.importerUtil = importerUtil;
        this.fikaConfig = fikaConfig;
    }
    async execute(_container) {
        const database = this.databaseServer.getTables();
        const databasePath = node_path_1.default.join(this.fikaConfig.getModPath(), "assets/database/");
        const locales = await this.importerUtil.loadAsync(node_path_1.default.join(databasePath, "locales/"), databasePath);
        database.locales = { ...database.locales, ...locales };
    }
};
exports.LocalesOverride = LocalesOverride;
exports.LocalesOverride = LocalesOverride = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("DatabaseServer")),
    __param(1, (0, tsyringe_1.inject)("ImporterUtil")),
    __param(2, (0, tsyringe_1.inject)("FikaConfig")),
    __metadata("design:paramtypes", [typeof (_a = typeof DatabaseServer_1.DatabaseServer !== "undefined" && DatabaseServer_1.DatabaseServer) === "function" ? _a : Object, typeof (_b = typeof ImporterUtil_1.ImporterUtil !== "undefined" && ImporterUtil_1.ImporterUtil) === "function" ? _b : Object, typeof (_c = typeof FikaConfig_1.FikaConfig !== "undefined" && FikaConfig_1.FikaConfig) === "function" ? _c : Object])
], LocalesOverride);
//# sourceMappingURL=Locales.js.map
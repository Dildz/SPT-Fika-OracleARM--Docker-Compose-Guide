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
exports.FikaConfig = void 0;
const node_path_1 = __importDefault(require("node:path"));
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const PreSptModLoader_1 = require("/snapshot/project/obj/loaders/PreSptModLoader");
const JsonUtil_1 = require("/snapshot/project/obj/utils/JsonUtil");
const VFS_1 = require("/snapshot/project/obj/utils/VFS");
const package_json_1 = __importDefault(require("../../package.json"));
let FikaConfig = class FikaConfig {
    preSptModLoader;
    vfs;
    jsonUtil;
    modAuthor;
    modName;
    modPath;
    fikaConfig;
    constructor(preSptModLoader, vfs, jsonUtil) {
        this.preSptModLoader = preSptModLoader;
        this.vfs = vfs;
        this.jsonUtil = jsonUtil;
        this.modAuthor = package_json_1.default.author.replace(/\W/g, "").toLowerCase();
        this.modName = package_json_1.default.name.replace(/\W/g, "").toLowerCase();
        this.modPath = this.preSptModLoader.getModPath(this.getModFolderName());
        this.fikaConfig = this.jsonUtil.deserializeJsonC(this.vfs.readFile(node_path_1.default.join(this.modPath, "assets/configs/fika.jsonc")));
    }
    getConfig() {
        return this.fikaConfig;
    }
    getModFolderName() {
        return `${this.modAuthor}-${this.modName}`;
    }
    getModPath() {
        return this.modPath;
    }
};
exports.FikaConfig = FikaConfig;
exports.FikaConfig = FikaConfig = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PreSptModLoader")),
    __param(1, (0, tsyringe_1.inject)("VFS")),
    __param(2, (0, tsyringe_1.inject)("JsonUtil")),
    __metadata("design:paramtypes", [typeof (_a = typeof PreSptModLoader_1.PreSptModLoader !== "undefined" && PreSptModLoader_1.PreSptModLoader) === "function" ? _a : Object, typeof (_b = typeof VFS_1.VFS !== "undefined" && VFS_1.VFS) === "function" ? _b : Object, typeof (_c = typeof JsonUtil_1.JsonUtil !== "undefined" && JsonUtil_1.JsonUtil) === "function" ? _c : Object])
], FikaConfig);
//# sourceMappingURL=FikaConfig.js.map
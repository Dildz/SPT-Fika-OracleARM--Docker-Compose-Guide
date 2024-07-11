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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LauncherBackgroundOverride = void 0;
const node_path_1 = __importDefault(require("node:path"));
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const ImageRouter_1 = require("/snapshot/project/obj/routers/ImageRouter");
const Override_1 = require("../../di/Override");
const FikaConfig_1 = require("../../utils/FikaConfig");
let LauncherBackgroundOverride = class LauncherBackgroundOverride extends Override_1.Override {
    imageRouter;
    fikaConfig;
    constructor(imageRouter, fikaConfig) {
        super();
        this.imageRouter = imageRouter;
        this.fikaConfig = fikaConfig;
    }
    execute(_container) {
        this.imageRouter.addRoute("/files/launcher/bg", node_path_1.default.join(this.fikaConfig.getModPath(), "db/launcher_bg.png"));
    }
};
exports.LauncherBackgroundOverride = LauncherBackgroundOverride;
exports.LauncherBackgroundOverride = LauncherBackgroundOverride = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ImageRouter")),
    __param(1, (0, tsyringe_1.inject)("FikaConfig")),
    __metadata("design:paramtypes", [typeof (_a = typeof ImageRouter_1.ImageRouter !== "undefined" && ImageRouter_1.ImageRouter) === "function" ? _a : Object, typeof (_b = typeof FikaConfig_1.FikaConfig !== "undefined" && FikaConfig_1.FikaConfig) === "function" ? _b : Object])
], LauncherBackgroundOverride);
//# sourceMappingURL=LauncherBackground.js.map
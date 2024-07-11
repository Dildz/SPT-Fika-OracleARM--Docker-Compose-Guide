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
exports.FikaServerTools = void 0;
const ILogger_1 = require("/snapshot/project/obj/models/spt/utils/ILogger");
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const FikaConfig_1 = require("./FikaConfig");
const ConfigServer_1 = require("/snapshot/project/obj/servers/ConfigServer");
const ConfigTypes_1 = require("/snapshot/project/obj/models/enums/ConfigTypes");
const child_process_1 = require("child_process");
const node_path_1 = __importDefault(require("node:path"));
const fs_1 = __importDefault(require("fs"));
let FikaServerTools = class FikaServerTools {
    logger;
    fikaConfig;
    configServer;
    name = "FikaServerTools";
    exePath;
    natPunchServerConfig;
    httpConfig;
    processes = {};
    constructor(logger, fikaConfig, configServer) {
        this.logger = logger;
        this.fikaConfig = fikaConfig;
        this.configServer = configServer;
        this.exePath = node_path_1.default.join(node_path_1.default.join(__dirname, "../../"), "FikaServerTools.exe");
        this.natPunchServerConfig = fikaConfig.getConfig().natPunchServer;
        this.httpConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.HTTP);
    }
    startService(serviceName) {
        var exeArgs;
        switch (serviceName) {
            case "NatPunchServer":
                const ip = this.httpConfig.backendIp;
                const port = this.natPunchServerConfig.port;
                const natIntroduceAmount = this.natPunchServerConfig.natIntroduceAmount;
                exeArgs = `-NatPunchServer -IP ${ip} -Port ${port} -NatIntroduceAmount ${natIntroduceAmount}`.split(" ");
                break;
            default:
                this.logError(this.name, `Unknown service name provided: ${serviceName}`);
                return;
        }
        if (!fs_1.default.existsSync(this.exePath)) {
            this.logError(this.name, `File not found: ${this.exePath}`);
            return;
        }
        if (serviceName in this.processes) {
            this.stopService(serviceName);
        }
        const process = (0, child_process_1.spawn)(this.exePath, exeArgs);
        process.stdout.on("data", data => {
            var dataStr = data.toString();
            dataStr = dataStr.substring(0, dataStr.length - 1);
            this.logInfo(serviceName, dataStr);
        });
        process.stderr.on("data", data => {
            var dataStr = data.toString();
            dataStr = dataStr.substring(0, dataStr.length - 1);
            this.logError(serviceName, dataStr);
        });
        process.on("exit", code => {
            this.logError(this.name, `FikaServerTools ended with code ${code}`);
        });
        this.processes[serviceName] = process;
        return;
    }
    stopService(serviceName) {
        if (serviceName in this.processes) {
            const process = this.processes[serviceName];
            if (process != null) {
                if (!process.killed) {
                    process.kill();
                }
            }
        }
    }
    logInfo(serviceName, msg) {
        this.logger.info(`[${serviceName}] ${msg}`);
    }
    logError(serviceName, msg) {
        this.logger.error(`[${serviceName}] ${msg}`);
    }
};
exports.FikaServerTools = FikaServerTools;
exports.FikaServerTools = FikaServerTools = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("FikaConfig")),
    __param(2, (0, tsyringe_1.inject)("ConfigServer")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof FikaConfig_1.FikaConfig !== "undefined" && FikaConfig_1.FikaConfig) === "function" ? _b : Object, typeof (_c = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _c : Object])
], FikaServerTools);
//# sourceMappingURL=FikaServerTools.js.map
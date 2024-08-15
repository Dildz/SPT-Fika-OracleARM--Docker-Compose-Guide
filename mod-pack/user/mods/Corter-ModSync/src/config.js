"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigUtil = exports.Config = void 0;
const node_path_1 = __importDefault(require("node:path"));
const glob_1 = require("./glob");
const utility_1 = require("./utility");
class Config {
    syncPaths;
    commonModExclusions;
    constructor(syncPaths, commonModExclusions) {
        this.syncPaths = syncPaths;
        this.commonModExclusions = commonModExclusions;
    }
    get enabledSyncPaths() {
        return this.syncPaths.filter(({ enabled }) => enabled);
    }
    isExcluded(filePath) {
        return this.commonModExclusions.some((exclusion) => (0, glob_1.glob)(exclusion).test((0, utility_1.unixPath)(filePath)));
    }
    isParentExcluded(filePath) {
        return this.commonModExclusions.some((exclusion) => (0, glob_1.globNoEnd)(exclusion).test((0, utility_1.unixPath)(filePath)));
    }
}
exports.Config = Config;
class ConfigUtil {
    vfs;
    jsonUtil;
    modImporter;
    logger;
    constructor(vfs, jsonUtil, modImporter, logger) {
        this.vfs = vfs;
        this.jsonUtil = jsonUtil;
        this.modImporter = modImporter;
        this.logger = logger;
    }
    /**
     * @throws {Error} If the config file does not exist
     */
    readConfigFile() {
        const modPath = this.modImporter.getModPath("Corter-ModSync");
        const configPath = node_path_1.default.join(modPath, "src", "config.jsonc");
        return this.jsonUtil.deserializeJsonC(this.vfs.readFile(configPath), "config.jsonc");
    }
    /**
     * @throws {Error} If the config is invalid
     */
    validateConfig(config) {
        if (!Array.isArray(config.syncPaths))
            throw new Error("Corter-ModSync: config.jsonc 'syncPaths' is not an array. Please verify your config is correct and try again.");
        if (!Array.isArray(config.commonModExclusions))
            throw new Error("Corter-ModSync: config.jsonc 'commonModExclusions' is not an array. Please verify your config is correct and try again.");
        for (const syncPath of config.syncPaths) {
            if (typeof syncPath !== "string" && !("path" in syncPath))
                throw new Error("Corter-ModSync: config.jsonc 'syncPaths' is missing 'path'. Please verify your config is correct and try again.");
            if (typeof syncPath === "string"
                ? node_path_1.default.isAbsolute(syncPath)
                : node_path_1.default.isAbsolute(syncPath.path))
                throw new Error(`Corter-ModSync: SyncPaths must be relative to SPT server root. Invalid path '${syncPath}'`);
            if (node_path_1.default
                .relative(process.cwd(), node_path_1.default.resolve(process.cwd(), typeof syncPath === "string" ? syncPath : syncPath.path))
                .startsWith(".."))
                throw new Error(`Corter-ModSync: SyncPaths must within SPT server root. Invalid path '${syncPath}'`);
        }
    }
    load() {
        const rawConfig = this.readConfigFile();
        this.validateConfig(rawConfig);
        return new Config(rawConfig.syncPaths
            .map((syncPath) => ({
            enabled: true,
            // Not yet implemented
            // force: false,
            // silent: false,
            ...(typeof syncPath === "string" ? { path: syncPath } : syncPath),
        })), rawConfig.commonModExclusions);
    }
}
exports.ConfigUtil = ConfigUtil;
//# sourceMappingURL=config.js.map
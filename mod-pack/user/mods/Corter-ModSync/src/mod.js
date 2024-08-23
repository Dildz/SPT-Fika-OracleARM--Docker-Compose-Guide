"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
const config_1 = require("./config");
const sync_1 = require("./sync");
const router_1 = require("./router");
class Mod {
    static container;
    static loadFailed = false;
    static config;
    async preSptLoad(container) {
        Mod.container = container;
        const logger = container.resolve("WinstonLogger");
        const vfs = container.resolve("VFS");
        const jsonUtil = container.resolve("JsonUtil");
        const modImporter = container.resolve("PreSptModLoader");
        const configUtil = new config_1.ConfigUtil(vfs, jsonUtil, modImporter, logger);
        const httpListenerService = container.resolve("HttpListenerModService");
        httpListenerService.registerHttpListener("ModSyncListener", this.canHandleOverride, this.handleOverride);
        try {
            Mod.config = await configUtil.load();
        }
        catch (e) {
            Mod.loadFailed = true;
            logger.error("Corter-ModSync: Failed to load config!");
            throw e;
        }
    }
    canHandleOverride(_sessionId, req) {
        return !Mod.loadFailed && (req.url?.startsWith("/modsync/") ?? false);
    }
    async handleOverride(_sessionId, req, res) {
        const logger = Mod.container.resolve("WinstonLogger");
        const vfs = Mod.container.resolve("VFS");
        const httpFileUtil = Mod.container.resolve("HttpFileUtil");
        const httpServerHelper = Mod.container.resolve("HttpServerHelper");
        const modImporter = Mod.container.resolve("PreSptModLoader");
        const syncUtil = new sync_1.SyncUtil(vfs, Mod.config, logger);
        const router = new router_1.Router(Mod.config, syncUtil, vfs, httpFileUtil, httpServerHelper, modImporter, logger);
        try {
            router.handleRequest(req, res);
        }
        catch (e) {
            logger.error("Corter-ModSync: Failed to handle request!");
            throw e;
        }
    }
}
exports.mod = new Mod();
//# sourceMappingURL=mod.js.map
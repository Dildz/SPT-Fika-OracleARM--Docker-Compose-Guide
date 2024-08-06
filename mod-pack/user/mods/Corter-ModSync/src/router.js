"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const glob_1 = require("./glob");
const node_path_1 = __importDefault(require("node:path"));
const utility_1 = require("./utility");
const node_fs_1 = require("node:fs");
class Router {
    config;
    syncUtil;
    vfs;
    httpFileUtil;
    modImporter;
    logger;
    constructor(config, syncUtil, vfs, httpFileUtil, modImporter, logger) {
        this.config = config;
        this.syncUtil = syncUtil;
        this.vfs = vfs;
        this.httpFileUtil = httpFileUtil;
        this.modImporter = modImporter;
        this.logger = logger;
    }
    /**
     * @internal
     */
    getServerVersion(res, _) {
        const modPath = this.modImporter.getModPath("Corter-ModSync");
        const packageJson = JSON.parse(this.vfs.readFile(node_path_1.default.join(modPath, "package.json")));
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200, "OK");
        res.end(JSON.stringify(packageJson.version));
    }
    /**
     * @internal
     */
    getSyncPaths(res, _) {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200, "OK");
        res.end(JSON.stringify(this.config.enabledSyncPaths.map(({ path }) => (0, utility_1.winPath)(path))));
    }
    /**
     * @internal
     */
    getHashes(res, _) {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200, "OK");
        res.end(JSON.stringify(this.syncUtil.hashModFiles(this.config.enabledSyncPaths)));
    }
    /**
     * @internal
     */
    fetchModFile(res, matches) {
        const filePath = decodeURIComponent(matches[1]);
        const sanitizedPath = this.syncUtil.sanitizeDownloadPath(filePath, this.config.enabledSyncPaths);
        if (!this.vfs.exists(sanitizedPath))
            throw new utility_1.HttpError(404, `Attempt to access non-existent path ${filePath}`);
        try {
            const fileStats = (0, node_fs_1.statSync)(sanitizedPath);
            res.setHeader("Content-Length", fileStats.size);
            this.httpFileUtil.sendFile(res, sanitizedPath);
        }
        catch (e) {
            throw new utility_1.HttpError(500, `Corter-ModSync: Error reading '${filePath}'\n${e}`);
        }
    }
    handleRequest(req, res) {
        const routeTable = [
            {
                route: (0, glob_1.glob)("/modsync/version"),
                handler: this.getServerVersion.bind(this),
            },
            {
                route: (0, glob_1.glob)("/modsync/paths"),
                handler: this.getSyncPaths.bind(this),
            },
            {
                route: (0, glob_1.glob)("/modsync/hashes"),
                handler: this.getHashes.bind(this),
            },
            {
                route: (0, glob_1.glob)("/modsync/fetch/**"),
                handler: this.fetchModFile.bind(this),
            },
        ];
        try {
            for (const { route, handler } of routeTable) {
                const matches = route.exec(req.url || "");
                if (matches)
                    return handler(res, matches);
            }
            throw new utility_1.HttpError(404, "Corter-ModSync: Unknown route");
        }
        catch (e) {
            this.logger.error(`Corter-ModSync: Error when handling [${req.method} ${req.url}]:\n${e}`);
            if (e instanceof utility_1.HttpError) {
                res.writeHead(e.code, e.codeMessage);
                res.end(e.message);
            }
            else {
                res.writeHead(500, "Internal server error");
                res.end(`Corter-ModSync: Error handling [${req.method} ${req.url}]:\n${e}`);
            }
        }
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map
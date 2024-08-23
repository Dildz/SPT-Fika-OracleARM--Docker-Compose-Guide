"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const glob_1 = require("./glob");
const node_path_1 = __importDefault(require("node:path"));
const utility_1 = require("./utility");
const FALLBACK_SYNCPATHS = {
    undefined: ["BepInEx\\plugins\\Corter-ModSync.dll", "ModSync.Updater.exe"],
};
const FALLBACK_HASHES = {
    undefined: {
        "BepInEx\\plugins\\Corter-ModSync.dll": { crc: 999999999 },
        "ModSync.Updater.exe": { crc: 999999999 },
    },
};
class Router {
    config;
    syncUtil;
    vfs;
    httpFileUtil;
    httpServerHelper;
    modImporter;
    logger;
    constructor(config, syncUtil, vfs, httpFileUtil, httpServerHelper, modImporter, logger) {
        this.config = config;
        this.syncUtil = syncUtil;
        this.vfs = vfs;
        this.httpFileUtil = httpFileUtil;
        this.httpServerHelper = httpServerHelper;
        this.modImporter = modImporter;
        this.logger = logger;
    }
    /**
     * @internal
     */
    async getServerVersion(req, res, _) {
        const modPath = this.modImporter.getModPath("Corter-ModSync");
        const packageJson = JSON.parse(
        // @ts-expect-error readFile returns a string when given a valid encoding
        await this.vfs
            // @ts-expect-error readFile takes in an options object, including an encoding option
            .readFilePromisify(node_path_1.default.join(modPath, "package.json"), {
            encoding: "utf-8",
        }));
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200, "OK");
        res.end(JSON.stringify(packageJson.version));
    }
    /**
     * @internal
     */
    async getSyncPaths(req, res, _) {
        const version = req.headers["modsync-version"];
        if (version in FALLBACK_SYNCPATHS) {
            res.setHeader("Content-Type", "application/json");
            res.writeHead(200, "OK");
            res.end(JSON.stringify(FALLBACK_SYNCPATHS[version]));
            return;
        }
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200, "OK");
        res.end(JSON.stringify(this.config.syncPaths.map(({ path, ...rest }) => ({
            path: (0, utility_1.winPath)(path),
            ...rest,
        }))));
    }
    /**
     * @internal
     */
    async getHashes(req, res, _) {
        const version = req.headers["modsync-version"];
        if (version in FALLBACK_HASHES) {
            res.setHeader("Content-Type", "application/json");
            res.writeHead(200, "OK");
            res.end(JSON.stringify(FALLBACK_HASHES[version]));
            return;
        }
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200, "OK");
        res.end(JSON.stringify(await this.syncUtil.hashModFiles(this.config.syncPaths)));
    }
    /**
     * @internal
     */
    async fetchModFile(_, res, matches) {
        const filePath = decodeURIComponent(matches[1]);
        const sanitizedPath = this.syncUtil.sanitizeDownloadPath(filePath, this.config.syncPaths);
        if (!this.vfs.exists(sanitizedPath))
            throw new utility_1.HttpError(404, `Attempt to access non-existent path ${filePath}`);
        try {
            const fileStats = await this.vfs.statPromisify(sanitizedPath);
            res.setHeader("Content-Type", this.httpServerHelper.getMimeText(node_path_1.default.extname(filePath)) ||
                "text/plain");
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
                    return handler(req, res, matches);
            }
            throw new utility_1.HttpError(404, "Corter-ModSync: Unknown route");
        }
        catch (e) {
            if (e instanceof Error)
                this.logger.error(`Corter-ModSync: Error when handling [${req.method} ${req.url}]:\n${e.message}\n${e.stack}`);
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
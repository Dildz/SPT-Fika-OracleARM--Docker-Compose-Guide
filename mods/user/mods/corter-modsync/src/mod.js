"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const promises_1 = require("node:fs/promises");
const buffer_crc32_1 = __importDefault(require("/snapshot/project/node_modules/buffer-crc32"));
class Mod {
    static container;
    static loadFailed = false;
    modFileHashes;
    static config;
    static commonModExclusionsRegex;
    static syncPathsUpdated = false;
    preAkiLoad(container) {
        Mod.container = container;
        const logger = container.resolve("WinstonLogger");
        const vfs = container.resolve("VFS");
        const jsonUtil = container.resolve("JsonUtil");
        const httpListenerService = container.resolve("HttpListenerModService");
        httpListenerService.registerHttpListener("ModSyncListener", this.canHandleOverride, this.handleOverride);
        Mod.config = jsonUtil.deserializeJsonC(vfs.readFile(node_path_1.default.join(__dirname, "config.jsonc")), "config.jsonc");
        if (Mod.config.syncPaths === undefined ||
            Mod.config.commonModExclusions === undefined) {
            Mod.loadFailed = true;
            throw new Error("Corter-ModSync: One or more required config values is missing. Please verify your config is correct and try again.");
        }
        Mod.commonModExclusionsRegex = Mod.config.commonModExclusions.map((exclusion) => new RegExp(exclusion
            .split(node_path_1.default.posix.sep)
            .join(node_path_1.default.sep)
            .replaceAll("\\", "\\\\")));
        if (Mod.config.syncPaths === undefined ||
            Mod.config.syncPaths.length === 0) {
            logger.warning("Corter-ModSync: No sync paths configured. Mod will not be loaded.");
            Mod.loadFailed = true;
        }
        for (const syncPath of Mod.config.syncPaths) {
            node_fs_1.default.watch(syncPath, { recursive: true, persistent: false }, (e, filename) => {
                if (filename &&
                    Mod.commonModExclusionsRegex.some((exclusion) => exclusion.test(node_path_1.default.join(syncPath, filename))))
                    return;
                if (!Mod.syncPathsUpdated) {
                    logger.warning(`Corter-ModSync: '${node_path_1.default.join(syncPath, filename ?? "")}' was changed while the server is running. If server mods were updated, those changes will not take effect until after the server is restarted.`);
                    Mod.syncPathsUpdated = true;
                }
            });
        }
        for (const syncPath in Mod.config.syncPaths) {
            if (node_path_1.default.isAbsolute(syncPath)) {
                throw new Error(`Corter-ModSync: SyncPaths must be relative to SPT server root. Invalid path '${syncPath}'`);
            }
            if (node_path_1.default
                .relative(process.cwd(), node_path_1.default.resolve(process.cwd(), syncPath))
                .startsWith("..")) {
                throw new Error(`Corter-ModSync: SyncPaths must within SPT server root. Invalid path '${syncPath}'`);
            }
        }
    }
    canHandleOverride(_sessionId, req) {
        return !Mod.loadFailed && (req.url?.startsWith("/modsync/") ?? false);
    }
    async handleOverride(_sessionId, req, resp) {
        const logger = Mod.container.resolve("WinstonLogger");
        const vfs = Mod.container.resolve("VFS");
        const httpFileUtil = Mod.container.resolve("HttpFileUtil");
        const getFileHashes = async (hashPaths) => {
            const getFilesInDir = (dir) => {
                try {
                    return [
                        ...vfs
                            .getFiles(dir)
                            .map((file) => node_path_1.default.join(dir, file))
                            .filter((file) => !file.endsWith(".nosync") &&
                            !file.endsWith(".nosync.txt") &&
                            !vfs.exists(`${file}.nosync`) &&
                            !vfs.exists(`${file}.nosync.txt`) &&
                            !Mod.commonModExclusionsRegex.some((exclusion) => exclusion.test(file))),
                        ...vfs
                            .getDirs(dir)
                            .map((subDir) => node_path_1.default.join(dir, subDir))
                            .filter((subDir) => !vfs.exists(node_path_1.default.join(subDir, ".nosync")) &&
                            !vfs.exists(node_path_1.default.join(subDir, ".nosync.txt")) &&
                            !Mod.commonModExclusionsRegex.some((exclusion) => exclusion.test(subDir)))
                            .flatMap((subDir) => getFilesInDir(subDir)),
                    ];
                }
                catch {
                    return [];
                }
            };
            const buildModFile = async (file) => {
                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                const parent = hashPaths.find((syncPath) => !node_path_1.default.relative(syncPath, file).startsWith(".."));
                return [
                    node_path_1.default
                        .join(parent, node_path_1.default.relative(parent, file))
                        .split(node_path_1.default.sep)
                        .join(node_path_1.default.win32.sep),
                    {
                        crc: buffer_crc32_1.default.unsigned(await (0, promises_1.readFile)(file)),
                        modified: await (0, promises_1.stat)(file).then(({ mtimeMs }) => mtimeMs),
                    },
                ];
            };
            const dirs = hashPaths.filter((syncPath) => node_fs_1.default.lstatSync(syncPath).isDirectory());
            const files = hashPaths.filter((syncPath) => node_fs_1.default.lstatSync(syncPath).isFile());
            return Object.fromEntries([
                ...(await Promise.all(files.map((file) => node_path_1.default.join(process.cwd(), file)).map(buildModFile))),
                ...(await Promise.all(dirs
                    .map((dir) => node_path_1.default.join(process.cwd(), dir))
                    .flatMap((dir) => getFilesInDir(dir).map(buildModFile)))),
            ]);
        };
        const sanitizeFilePath = (file) => {
            const sanitizedPath = node_path_1.default.join(node_path_1.default.normalize(file).replace(/^(\.\.(\/|\\|$))+/, ""));
            return (!Mod.config.syncPaths?.every((subDir) => node_path_1.default
                .relative(node_path_1.default.join(process.cwd(), subDir), sanitizedPath)
                .startsWith("..")) && sanitizedPath);
        };
        try {
            if (req.url === "/modsync/version") {
                const packageJson = JSON.parse(vfs.readFile(node_path_1.default.resolve(__dirname, "../package.json")));
                resp.setHeader("Content-Type", "application/json");
                resp.writeHead(200, "OK");
                resp.end(JSON.stringify(packageJson.version));
            }
            else if (req.url === "/modsync/paths") {
                resp.setHeader("Content-Type", "application/json");
                resp.writeHead(200, "OK");
                resp.end(JSON.stringify(Mod.config.syncPaths.map((dir) => dir.split(node_path_1.default.posix.sep).join(node_path_1.default.win32.sep))));
            }
            else if (req.url === "/modsync/hashes") {
                if (this.modFileHashes === undefined || Mod.syncPathsUpdated) {
                    Mod.syncPathsUpdated = false;
                    this.modFileHashes = await getFileHashes(Mod.config.syncPaths);
                }
                resp.setHeader("Content-Type", "application/json");
                resp.writeHead(200, "OK");
                resp.end(JSON.stringify(this.modFileHashes));
            }
            else if (req.url?.startsWith("/modsync/fetch/")) {
                const filePath = decodeURIComponent(
                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                req.url.split("/modsync/fetch/").at(-1));
                const sanitizedPath = sanitizeFilePath(filePath);
                if (!sanitizedPath) {
                    logger.warning(`Attempt to access invalid path ${filePath}`);
                    resp.writeHead(400, "Bad request");
                    resp.end("Invalid path");
                    return;
                }
                if (!vfs.exists(sanitizedPath)) {
                    logger.warning(`Attempt to access non-existent path ${filePath}`);
                    resp.writeHead(404, "Not found");
                    resp.end(`File ${filePath} not found`);
                    return;
                }
                const fileStats = await vfs.statPromisify(sanitizedPath);
                resp.setHeader("Content-Length", fileStats.size);
                httpFileUtil.sendFile(resp, sanitizedPath);
            }
            else {
                logger.warning(`No route found for ${req.url}`);
                resp.writeHead(404, "Not found");
                resp.end(`No route found for ${req.url}`);
            }
        }
        catch (e) {
            if (e instanceof Error) {
                logger.error(e.toString());
                resp.writeHead(500, "Internal server error");
                resp.end(e.toString());
            }
        }
    }
}
exports.mod = new Mod();
//# sourceMappingURL=mod.js.map
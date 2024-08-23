"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncUtil = void 0;
const node_path_1 = __importDefault(require("node:path"));
const crc_1 = require("./crc");
const utility_1 = require("./utility");
const node_fs_1 = require("node:fs");
class SyncUtil {
    vfs;
    config;
    logger;
    limiter = new utility_1.Semaphore(1024);
    constructor(vfs, config, logger) {
        this.vfs = vfs;
        this.config = config;
        this.logger = logger;
    }
    async getFilesInDir(dir) {
        if (!this.vfs.exists(dir)) {
            this.logger.warning(`Corter-ModSync: Directory '${dir}' does not exist, will be ignored.`);
            return [];
        }
        const stats = await this.vfs.statPromisify(dir);
        if (stats.isFile())
            return [
                [
                    dir,
                    this.config.isExcluded(dir) ||
                        this.vfs.exists(node_path_1.default.join(dir, ".nosync")) ||
                        this.vfs.exists(node_path_1.default.join(dir, ".nosync.txt")),
                ],
            ];
        const nosyncDir = this.config.isExcluded(dir) ||
            this.vfs.exists(node_path_1.default.join(dir, ".nosync")) ||
            this.vfs.exists(node_path_1.default.join(dir, ".nosync.txt"));
        return (await Promise.all(this.vfs
            .getFiles(dir)
            .filter((file) => !file.endsWith(".nosync") && !file.endsWith(".nosync.txt"))
            .map(async (file) => [
            node_path_1.default.join(dir, file),
            nosyncDir ||
                this.config.isExcluded(node_path_1.default.join(dir, file)) ||
                this.vfs.exists(`${node_path_1.default.join(dir, file)}.nosync`) ||
                this.vfs.exists(`${node_path_1.default.join(dir, file)}.nosync.txt`),
        ]))).concat((await Promise.all(this.vfs
            .getDirs(dir)
            .map((subDir) => this.getFilesInDir(node_path_1.default.join(dir, subDir)))))
            .flat()
            .map(([child, nosync]) => [
            child,
            nosyncDir || nosync,
        ]));
    }
    async buildModFile(file, 
    // biome-ignore lint/correctness/noEmptyPattern: <explanation>
    {}, nosync) {
        try {
            let crc = 0;
            if (!nosync) {
                const lock = await this.limiter.acquire();
                crc = await new Promise((resolve, reject) => {
                    let crc = (0, crc_1.crc32Init)();
                    (0, node_fs_1.createReadStream)(file)
                        .on("error", reject)
                        .on("data", (data) => {
                        crc = (0, crc_1.crc32Update)(crc, data);
                    })
                        .on("end", () => {
                        resolve((0, crc_1.crc32Final)(crc));
                    });
                });
                lock.release();
            }
            return {
                nosync,
                crc,
            };
        }
        catch (e) {
            throw new utility_1.HttpError(500, `Corter-ModSync: Error reading '${file}'\n${e}`);
        }
    }
    async hashModFiles(syncPaths) {
        return Object.fromEntries(await Promise.all(syncPaths.map(async (syncPath) => [
            (0, utility_1.winPath)(syncPath.path),
            Object.fromEntries(await Promise.all((await this.getFilesInDir(syncPath.path)).map(async ([file, nosync]) => [
                (0, utility_1.winPath)(file),
                await this.buildModFile(file, syncPath, nosync),
            ]))),
        ])));
    }
    /**
     * @throws {Error} If file path is invalid
     */
    sanitizeDownloadPath(file, syncPaths) {
        const normalized = node_path_1.default.join(node_path_1.default.normalize(file).replace(/^(\.\.(\/|\\|$))+/, ""));
        if (!syncPaths.some(({ path: p }) => !node_path_1.default
            .relative(node_path_1.default.join(process.cwd(), p), normalized)
            .startsWith("..")))
            throw new utility_1.HttpError(400, `Corter-ModSync: Requested file '${file}' is not in an enabled sync path!`);
        return normalized;
    }
}
exports.SyncUtil = SyncUtil;
//# sourceMappingURL=sync.js.map
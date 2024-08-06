"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncUtil = void 0;
const node_path_1 = __importDefault(require("node:path"));
const buffer_crc32_1 = __importDefault(require("/snapshot/project/node_modules/buffer-crc32"));
const utility_1 = require("./utility");
const node_fs_1 = __importDefault(require("node:fs"));
class SyncUtil {
    vfs;
    config;
    logger;
    constructor(vfs, config, logger) {
        this.vfs = vfs;
        this.config = config;
        this.logger = logger;
    }
    getFilesInDir(dir) {
        if (!this.vfs.exists(dir)) {
            this.logger.warning(`Corter-ModSync: Directory '${dir}' does not exist, will be ignored.`);
            return [];
        }
        if (node_fs_1.default.statSync(dir).isFile())
            return [dir];
        if (this.vfs.exists(node_path_1.default.join(dir, ".nosync")) ||
            this.vfs.exists(node_path_1.default.join(dir, ".nosync.txt")))
            return [];
        if (this.config.isExcluded(dir))
            return [];
        return this.vfs
            .getFiles(dir)
            .filter((file) => !this.config.isExcluded(node_path_1.default.join(dir, file)))
            .filter((file) => !file.endsWith(".nosync") && !file.endsWith(".nosync.txt"))
            .filter((file) => !this.vfs.exists(`${node_path_1.default.join(dir, file)}.nosync`) &&
            !this.vfs.exists(`${node_path_1.default.join(dir, file)}.nosync.txt`))
            .map((file) => node_path_1.default.join(dir, file))
            .concat(this.vfs
            .getDirs(dir)
            .flatMap((subDir) => this.getFilesInDir(node_path_1.default.join(dir, subDir))));
    }
    buildModFile(file, 
    // Not yet implemented
    // biome-ignore lint/correctness/noEmptyPattern: <explanation>
    {}) {
        try {
            return {
                crc: buffer_crc32_1.default.unsigned(node_fs_1.default.readFileSync(file)),
                // Not yet implemented
                // required,
                // silent,
            };
        }
        catch (e) {
            throw new utility_1.HttpError(500, `Corter-ModSync: Error reading '${file}'\n${e}`);
        }
    }
    hashModFiles(syncPaths) {
        return Object.fromEntries(syncPaths.flatMap((syncPath) => this.getFilesInDir(syncPath.path).map((file) => [(0, utility_1.winPath)(file), this.buildModFile(file, syncPath)])));
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
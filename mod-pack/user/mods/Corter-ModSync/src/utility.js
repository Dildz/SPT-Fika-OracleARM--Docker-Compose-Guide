"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Semaphore = exports.unixPath = exports.winPath = exports.HttpError = void 0;
const node_os_1 = require("node:os");
const node_path_1 = __importDefault(require("node:path"));
class HttpError extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.code = code;
    }
    get codeMessage() {
        switch (this.code) {
            case 400:
                return "Bad Request";
            case 404:
                return "Not Found";
            default:
                return "Internal Server Error";
        }
    }
}
exports.HttpError = HttpError;
function winPath(p) {
    return p.split(node_path_1.default.posix.sep).join(node_path_1.default.win32.sep);
}
exports.winPath = winPath;
function unixPath(p) {
    return p.split(node_path_1.default.win32.sep).join(node_path_1.default.posix.sep);
}
exports.unixPath = unixPath;
/**
 * A [[Semaphore]] is a tool that is used to control concurrent access to a common resource. This implementation
 * is used to apply a max-parallelism threshold.
 */
class Semaphore {
    max;
    running = 0;
    waiting = [];
    constructor(max = (0, node_os_1.cpus)().length) {
        this.max = max;
        if (max < 1) {
            throw new Error(`Semaphore was created with a max value of ${max} but the max value cannot be less than 1`);
        }
    }
    take() {
        if (this.waiting.length > 0 && this.running < this.max) {
            this.running++;
            // Get the next task from the queue
            const task = this.waiting.shift();
            // Resolve the promise to allow it to start, provide a release function
            task.resolve({ release: this.release });
        }
    }
    acquire() {
        if (this.running < this.max) {
            this.running++;
            return Promise.resolve({ release: this.release });
        }
        return new Promise((resolve, reject) => {
            this.waiting.push({ resolve, reject });
        });
    }
    release = () => {
        this.running--;
        this.take();
    };
    /**
     * Purge all waiting tasks from the [[Semaphore]]
     */
    purge() {
        this.waiting.forEach(task => {
            task.reject(new Error('The semaphore was purged and as a result this task has been cancelled'));
        });
        this.running = 0;
        this.waiting = [];
    }
}
exports.Semaphore = Semaphore;
//# sourceMappingURL=utility.js.map
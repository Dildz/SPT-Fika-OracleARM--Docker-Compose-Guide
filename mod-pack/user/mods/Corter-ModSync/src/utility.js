"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unixPath = exports.winPath = exports.HttpError = void 0;
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
//# sourceMappingURL=utility.js.map
"use strict";
// Full Credit to https://github.com/aleclarson/glob-regex
// Copyright (c) 2016 Alec Larson
Object.defineProperty(exports, "__esModule", { value: true });
exports.globNoEnd = exports.glob = void 0;
const dotRE = /\./g;
const dotPattern = "\\.";
const restRE = /\*\*$/g;
const restPattern = "(.+)";
// noinspection RegExpUnnecessaryNonCapturingGroup
const globRE = /(?:\*\*\/|\*\*|\*)/g;
const globPatterns = {
    "*": "([^/]+)", // no backslashes
    "**": "(.+/)?([^/]+)", // short for "**/*"
    "**/": "(.+/)?", // one or more directories
};
function mapToPattern(str) {
    return globPatterns[str];
}
function replace(glob) {
    return glob
        .replace(dotRE, dotPattern)
        .replace(restRE, restPattern)
        .replace(globRE, mapToPattern);
}
function join(globs) {
    return `((${globs.map(replace).join(")|(")}))`;
}
function glob(glob) {
    return new RegExp(`^${Array.isArray(glob) ? join(glob) : replace(glob)}$`);
}
exports.glob = glob;
function globNoEnd(glob) {
    return new RegExp(`^${Array.isArray(glob) ? join(glob) : replace(glob)}`);
}
exports.globNoEnd = globNoEnd;
//# sourceMappingURL=glob.js.map
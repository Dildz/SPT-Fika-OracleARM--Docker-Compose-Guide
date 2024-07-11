"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FikaClientModHashesHelper = void 0;
class FikaClientModHashesHelper {
    hashes;
    constructor() {
        this.hashes = new Map();
    }
    getLength() {
        return this.hashes.size;
    }
    exists(pluginId) {
        return this.hashes.has(pluginId);
    }
    getHash(pluginId) {
        return this.hashes.get(pluginId);
    }
    addHash(pluginId, hash) {
        this.hashes.set(pluginId, hash);
    }
}
exports.FikaClientModHashesHelper = FikaClientModHashesHelper;
//# sourceMappingURL=FikaClientModHashesHelper.js.map
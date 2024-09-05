"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
class Mod {
    postSptLoad(container) {
        // get the logger from the server container
        const logger = container.resolve("WinstonLogger");
        logger.info("Loading: Bundle Loading Sample");
    }
}
exports.mod = new Mod();
//# sourceMappingURL=mod.js.map
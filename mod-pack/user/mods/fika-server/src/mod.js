"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
const Container_1 = require("./di/Container");
class Mod {
    async preSptLoadAsync(container) {
        Container_1.Container.register(container);
        await container.resolve("Fika").preSptLoad(container);
    }
    async postSptLoadAsync(container) {
        await container.resolve("Fika").postSptLoad(container);
    }
}
exports.mod = new Mod();
//# sourceMappingURL=mod.js.map
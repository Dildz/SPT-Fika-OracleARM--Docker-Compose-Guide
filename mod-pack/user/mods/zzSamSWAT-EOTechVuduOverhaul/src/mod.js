"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Mod {
    postDBLoad(container) {
        const logger = container.resolve("WinstonLogger");
        const tables = container.resolve("DatabaseServer").getTables();
        const itemDB = tables.templates.items;
        let vudu = itemDB["5b3b99475acfc432ff4dcbee"];
        vudu._props.Prefab.path = "assets/content/items/mods/scopes/scope_30mm_eotech_vudu_1_6x24_overhaul.bundle";
        vudu._props.ModesCount = [7];
        vudu._props.AimSensitivity[0] = [
            0.7,
            0.7,
            0.7,
            0.7,
            0.7,
            0.7,
            0.7
        ];
        vudu._props.Zooms[0] = [
            1,
            1.5,
            2,
            3,
            4,
            5,
            6
        ];
    }
}
module.exports = { mod: new Mod() };
//# sourceMappingURL=mod.js.map
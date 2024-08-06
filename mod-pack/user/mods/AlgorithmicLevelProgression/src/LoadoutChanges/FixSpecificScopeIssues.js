"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixSpecificItemIssues = void 0;
const fixSpecificItemIssues = (inventory) => {
    const removeAccentScopeList = new Set([
        "6171407e50224f204c1da3c5", // Recknagel Era-Tac 30mm ring scope mount
        "61713cc4d8e3106d9806c109", // Recknagel Era-Tac 34mm ring scope mount
        "5b2389515acfc4771e1be0c0", // Burris AR-P.E.P.R. 30mm ring scope mount
        "5addc00b5acfc4001669f144", // M14 Vltor CASV-14 rail system
        "5a37ca54c4a282000d72296a", // JP Enterprises Flat-Top 30mm ring scope mount
        "5aa66c72e5b5b00016327c93", // Nightforce Magmount 34mm ring scope mount with Ruggedized Accessory Platform
    ]);
    removeAccentScopeList.forEach((id) => {
        if (inventory.mods?.[id]?.mod_scope_001) {
            inventory.mods[id].mod_scope_001 = [];
        }
        if (inventory.mods?.[id]?.mod_scope_002) {
            inventory.mods[id].mod_scope_002 = [];
        }
        if (inventory.mods?.[id]?.mod_scope_003) {
            inventory.mods[id].mod_scope_003 = [];
        }
    });
};
exports.fixSpecificItemIssues = fixSpecificItemIssues;
//# sourceMappingURL=FixSpecificScopeIssues.js.map
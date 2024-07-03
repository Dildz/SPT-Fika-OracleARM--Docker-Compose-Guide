"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Money_1 = require("/snapshot/project/obj/models/enums/Money");
class UIFixes {
    databaseServer;
    logger;
    preAkiLoad(container) {
        this.databaseServer = container.resolve("DatabaseServer");
        this.logger = container.resolve("WinstonLogger");
        const profileHelper = container.resolve("ProfileHelper");
        const staticRouterModService = container.resolve("StaticRouterModService");
        const jsonUtil = container.resolve("JsonUtil");
        // Handle scav profile for post-raid scav transfer swaps (fixed in 3.9.0)
        container.afterResolution("InventoryController", (_, inventoryController) => {
            const original = inventoryController.swapItem;
            inventoryController.swapItem = (pmcData, request, sessionID) => {
                let playerData = pmcData;
                if (request.fromOwner?.type === "Profile" && request.fromOwner.id !== playerData._id) {
                    playerData = profileHelper.getScavProfile(sessionID);
                }
                return original.call(inventoryController, playerData, request, sessionID);
            };
        }, { frequency: "Always" });
        // Keep quickbinds for items that aren't actually lost on death
        container.afterResolution("InRaidHelper", (_, inRaidHelper) => {
            const original = inRaidHelper.deleteInventory;
            inRaidHelper.deleteInventory = (pmcData, sessionId) => {
                // Copy the existing quickbinds
                const fastPanel = jsonUtil.clone(pmcData.Inventory.fastPanel);
                // Nukes the inventory and the fastpanel
                original.call(inRaidHelper, pmcData, sessionId);
                // Restore the quickbinds for items that still exist
                for (const index in fastPanel) {
                    if (pmcData.Inventory.items.find(i => i._id == fastPanel[index])) {
                        pmcData.Inventory.fastPanel[index] = fastPanel[index];
                    }
                }
            };
        }, { frequency: "Always" });
        // Handle barter sort type (fixed in 3.9.0)
        container.afterResolution("RagfairSortHelper", (_, ragfairSortHelper) => {
            const original = ragfairSortHelper.sortOffers;
            ragfairSortHelper.sortOffers = (offers, type, direction) => {
                if (+type == 2) {
                    offers.sort(this.sortOffersByBarter);
                }
                return original.call(ragfairSortHelper, offers, type, direction);
            };
        }, { frequency: "Always" });
        staticRouterModService.registerStaticRouter("UIFixesRoutes", [
            {
                url: "/uifixes/assortUnlocks",
                action: (url, info, sessionId, output) => {
                    return JSON.stringify(this.loadAssortmentUnlocks());
                }
            }
        ], "custom-static-ui-fixes");
    }
    loadAssortmentUnlocks() {
        const traders = this.databaseServer.getTables().traders;
        const quests = this.databaseServer.getTables().templates.quests;
        const result = {};
        for (const traderId in traders) {
            const trader = traders[traderId];
            if (trader.questassort) {
                for (const questStatus in trader.questassort) {
                    // Explicitly check that quest status is an expected value - some mods accidently import in such a way that adds a "default" value
                    if (!["started", "success", "fail"].includes(questStatus)) {
                        continue;
                    }
                    for (const assortId in trader.questassort[questStatus]) {
                        const questId = trader.questassort[questStatus][assortId];
                        if (!quests[questId]) {
                            this.logger.error(`Trader ${traderId} questassort references unknown quest ${JSON.stringify(questId)}!`);
                            continue;
                        }
                        result[assortId] = quests[questId].name;
                    }
                }
            }
        }
        return result;
    }
    sortOffersByBarter(a, b) {
        const moneyTpls = Object.values(Money_1.Money);
        const aIsOnlyMoney = a.requirements.length == 1 && moneyTpls.includes(a.requirements[0]._tpl) ? 1 : 0;
        const bIsOnlyMoney = b.requirements.length == 1 && moneyTpls.includes(b.requirements[0]._tpl) ? 1 : 0;
        return aIsOnlyMoney - bIsOnlyMoney;
    }
}
module.exports = { mod: new UIFixes() };
//# sourceMappingURL=mod.js.map
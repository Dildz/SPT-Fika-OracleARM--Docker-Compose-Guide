"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RagfairLinkedSlotItemService = void 0;
const ItemHelper_1 = require("/snapshot/project/obj/helpers/ItemHelper");
const ILogger_1 = require("/snapshot/project/obj/models/spt/utils/ILogger");
const DatabaseService_1 = require("/snapshot/project/obj/services/DatabaseService");
const RagfairLinkedItemService_1 = require("/snapshot/project/obj/services/RagfairLinkedItemService");
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
let RagfairLinkedSlotItemService = class RagfairLinkedSlotItemService extends RagfairLinkedItemService_1.RagfairLinkedItemService {
    databaseService;
    itemHelper;
    logger;
    constructor(databaseService, itemHelper, logger) {
        super(databaseService, itemHelper);
        this.databaseService = databaseService;
        this.itemHelper = itemHelper;
        this.logger = logger;
    }
    getLinkedItems(linkedSearchId) {
        const [tpl, slotName] = linkedSearchId.split(":", 2);
        if (slotName) {
            this.logger.info(`UIFixes: Finding items for specific slot ${tpl}:${slotName}`);
            const resultSet = this.getSpecificFilter(this.databaseService.getItems()[tpl], slotName);
            // Default Inventory, for equipment slots
            if (tpl === "55d7217a4bdc2d86028b456d") {
                const categories = [...resultSet];
                const items = Object.keys(this.databaseService.getItems()).filter(tpl => this.itemHelper.isOfBaseclasses(tpl, categories));
                // Send the categories along too, some of them might actually be items
                return new Set(items.concat(categories));
            }
            return resultSet;
        }
        return super.getLinkedItems(tpl);
    }
    getSpecificFilter(item, slotName) {
        const results = new Set();
        // For whatever reason, all chamber slots have the name "patron_in_weapon"
        const groupName = slotName === "patron_in_weapon" ? "Chambers" : "Slots";
        const group = item._props[groupName] ?? [];
        const sub = group.find(slot => slot._name === slotName);
        for (const filter of sub?._props?.filters ?? []) {
            for (const f of filter.Filter) {
                results.add(f);
            }
        }
        return results;
    }
};
exports.RagfairLinkedSlotItemService = RagfairLinkedSlotItemService;
exports.RagfairLinkedSlotItemService = RagfairLinkedSlotItemService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("DatabaseService")),
    __param(1, (0, tsyringe_1.inject)("ItemHelper")),
    __param(2, (0, tsyringe_1.inject)("PrimaryLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _a : Object, typeof (_b = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _b : Object, typeof (_c = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _c : Object])
], RagfairLinkedSlotItemService);
//# sourceMappingURL=RagfairLinkedSlotItemService.js.map
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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FikaSendItemController = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const InventoryHelper_1 = require("/snapshot/project/obj/helpers/InventoryHelper");
const ItemHelper_1 = require("/snapshot/project/obj/helpers/ItemHelper");
const ILogger_1 = require("/snapshot/project/obj/models/spt/utils/ILogger");
const EventOutputHolder_1 = require("/snapshot/project/obj/routers/EventOutputHolder");
const SaveServer_1 = require("/snapshot/project/obj/servers/SaveServer");
const MailSendService_1 = require("/snapshot/project/obj/services/MailSendService");
const HttpResponseUtil_1 = require("/snapshot/project/obj/utils/HttpResponseUtil");
const FikaConfig_1 = require("../utils/FikaConfig");
let FikaSendItemController = class FikaSendItemController {
    logger;
    eventOutputHolder;
    mailSendService;
    inventoryHelper;
    saveServer;
    itemHelper;
    httpResponse;
    fikaConfig;
    constructor(logger, eventOutputHolder, mailSendService, inventoryHelper, saveServer, itemHelper, httpResponse, fikaConfig) {
        this.logger = logger;
        this.eventOutputHolder = eventOutputHolder;
        this.mailSendService = mailSendService;
        this.inventoryHelper = inventoryHelper;
        this.saveServer = saveServer;
        this.itemHelper = itemHelper;
        this.httpResponse = httpResponse;
        this.fikaConfig = fikaConfig;
        // empty
    }
    sendItem(_pmcData, body, sessionID) {
        const fikaConfig = this.fikaConfig.getConfig();
        const output = this.eventOutputHolder.getOutput(sessionID);
        if (!body || !body.id || !body.target) {
            return this.httpResponse.appendErrorToOutput(output, "Missing data in body");
        }
        const senderProfile = this.saveServer.getProfile(sessionID);
        if (!senderProfile) {
            return this.httpResponse.appendErrorToOutput(output, "Sender profile not found");
        }
        // Disabled until functionality is required due to being buggy
        // if (senderProfile.inraid.location != "none") {
        //     return this.httpResponse.appendErrorToOutput(
        //         output,
        //         `You cannot send items while in raid, current state is: ${senderProfile.inraid.location}`
        //     );
        // }
        const targetProfile = this.saveServer.getProfile(body.target);
        if (!targetProfile) {
            return this.httpResponse.appendErrorToOutput(output, "Target profile not found");
        }
        this.logger.info(`${body.id} is going to sessionID: ${body.target}`);
        const senderItems = senderProfile.characters.pmc.Inventory.items;
        const itemsToSend = this.itemHelper.findAndReturnChildrenAsItems(senderItems, body.id);
        if (!itemsToSend || itemsToSend.length === 0) {
            return this.httpResponse.appendErrorToOutput(output, "Item not found in inventory");
        }
        if (fikaConfig.server.giftedItemsLoseFIR) {
            for (const item of itemsToSend) {
                item.upd ??= {};
                item.upd.SpawnedInSession = false;
            }
        }
        this.mailSendService.sendUserMessageToPlayer(body.target, {
            _id: senderProfile.info.id,
            aid: senderProfile.info.aid,
            Info: {
                Nickname: senderProfile.info.username,
                Side: senderProfile.characters.pmc.Info.Side,
                Level: senderProfile.characters.pmc.Info.Level,
                MemberCategory: senderProfile.characters.pmc.Info.MemberCategory,
            },
        }, `You have received a gift from ${senderProfile.info.username}`, itemsToSend);
        this.inventoryHelper.removeItem(senderProfile.characters.pmc, body.id, sessionID, output);
        return output;
    }
    /**
     * Get available receivers for sending an item
     * @param sessionID
     * @returns
     */
    handleAvailableReceivers(sessionID) {
        const sender = this.saveServer.getProfile(sessionID);
        if (!sender) {
            return;
        }
        const result = {};
        const profiles = this.saveServer.getProfiles();
        for (const profile of Object.values(profiles)) {
            const username = profile.info.username;
            if (!(username in result) && username !== sender.info.username) {
                result[username] = profile.info.id;
            }
        }
        return result;
    }
};
exports.FikaSendItemController = FikaSendItemController;
exports.FikaSendItemController = FikaSendItemController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("EventOutputHolder")),
    __param(2, (0, tsyringe_1.inject)("MailSendService")),
    __param(3, (0, tsyringe_1.inject)("InventoryHelper")),
    __param(4, (0, tsyringe_1.inject)("SaveServer")),
    __param(5, (0, tsyringe_1.inject)("ItemHelper")),
    __param(6, (0, tsyringe_1.inject)("HttpResponseUtil")),
    __param(7, (0, tsyringe_1.inject)("FikaConfig")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof EventOutputHolder_1.EventOutputHolder !== "undefined" && EventOutputHolder_1.EventOutputHolder) === "function" ? _b : Object, typeof (_c = typeof MailSendService_1.MailSendService !== "undefined" && MailSendService_1.MailSendService) === "function" ? _c : Object, typeof (_d = typeof InventoryHelper_1.InventoryHelper !== "undefined" && InventoryHelper_1.InventoryHelper) === "function" ? _d : Object, typeof (_e = typeof SaveServer_1.SaveServer !== "undefined" && SaveServer_1.SaveServer) === "function" ? _e : Object, typeof (_f = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _f : Object, typeof (_g = typeof HttpResponseUtil_1.HttpResponseUtil !== "undefined" && HttpResponseUtil_1.HttpResponseUtil) === "function" ? _g : Object, typeof (_h = typeof FikaConfig_1.FikaConfig !== "undefined" && FikaConfig_1.FikaConfig) === "function" ? _h : Object])
], FikaSendItemController);
//# sourceMappingURL=FikaSendItemController.js.map
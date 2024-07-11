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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyCustomProfileController = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const ProfileController_1 = require("/snapshot/project/obj/controllers/ProfileController");
const ProfileHelper_1 = require("/snapshot/project/obj/helpers/ProfileHelper");
const TimeUtil_1 = require("/snapshot/project/obj/utils/TimeUtil");
const ILogger_1 = require("/snapshot/project/obj/models/spt/utils/ILogger");
const HashUtil_1 = require("/snapshot/project/obj/utils/HashUtil");
const ICloner_1 = require("/snapshot/project/obj/utils/cloners/ICloner");
const PlayerScavGenerator_1 = require("/snapshot/project/obj/generators/PlayerScavGenerator");
const DialogueHelper_1 = require("/snapshot/project/obj/helpers/DialogueHelper");
const ItemHelper_1 = require("/snapshot/project/obj/helpers/ItemHelper");
const QuestHelper_1 = require("/snapshot/project/obj/helpers/QuestHelper");
const TraderHelper_1 = require("/snapshot/project/obj/helpers/TraderHelper");
const EventOutputHolder_1 = require("/snapshot/project/obj/routers/EventOutputHolder");
const SaveServer_1 = require("/snapshot/project/obj/servers/SaveServer");
const DatabaseService_1 = require("/snapshot/project/obj/services/DatabaseService");
const LocalisationService_1 = require("/snapshot/project/obj/services/LocalisationService");
const MailSendService_1 = require("/snapshot/project/obj/services/MailSendService");
const ProfileFixerService_1 = require("/snapshot/project/obj/services/ProfileFixerService");
const SeasonalEventService_1 = require("/snapshot/project/obj/services/SeasonalEventService");
/** Handle profile related client events */
let MyCustomProfileController = class MyCustomProfileController extends ProfileController_1.ProfileController {
    logger;
    hashUtil;
    cloner;
    timeUtil;
    saveServer;
    databaseService;
    itemHelper;
    profileFixerService;
    localisationService;
    seasonalEventService;
    mailSendService;
    playerScavGenerator;
    eventOutputHolder;
    traderHelper;
    dialogueHelper;
    questHelper;
    profileHelper;
    constructor(logger, hashUtil, cloner, timeUtil, saveServer, databaseService, itemHelper, profileFixerService, localisationService, seasonalEventService, mailSendService, playerScavGenerator, eventOutputHolder, traderHelper, dialogueHelper, questHelper, profileHelper) {
        // Pass the parent class (ProfileController) the dependencies it needs to work
        super(logger, hashUtil, cloner, timeUtil, saveServer, databaseService, itemHelper, profileFixerService, localisationService, seasonalEventService, mailSendService, playerScavGenerator, eventOutputHolder, traderHelper, dialogueHelper, questHelper, profileHelper);
        this.logger = logger;
        this.hashUtil = hashUtil;
        this.cloner = cloner;
        this.timeUtil = timeUtil;
        this.saveServer = saveServer;
        this.databaseService = databaseService;
        this.itemHelper = itemHelper;
        this.profileFixerService = profileFixerService;
        this.localisationService = localisationService;
        this.seasonalEventService = seasonalEventService;
        this.mailSendService = mailSendService;
        this.playerScavGenerator = playerScavGenerator;
        this.eventOutputHolder = eventOutputHolder;
        this.traderHelper = traderHelper;
        this.dialogueHelper = dialogueHelper;
        this.questHelper = questHelper;
        this.profileHelper = profileHelper;
    }
    setChosenProfileIcon(sessionId, request) {
        const profileToUpdate = this.profileHelper.getPmcProfile(sessionId);
        if (!profileToUpdate) {
            return false;
        }
        if (request.memberCategory !== null) {
            profileToUpdate.Info.SelectedMemberCategory = request.memberCategory;
        }
        if (request.squadInviteRestriction !== null) {
            profileToUpdate.Info.SquadInviteRestriction = request.squadInviteRestriction;
        }
        return true;
    }
};
exports.MyCustomProfileController = MyCustomProfileController;
exports.MyCustomProfileController = MyCustomProfileController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __param(2, (0, tsyringe_1.inject)("PrimaryCloner")),
    __param(3, (0, tsyringe_1.inject)("TimeUtil")),
    __param(4, (0, tsyringe_1.inject)("SaveServer")),
    __param(5, (0, tsyringe_1.inject)("DatabaseService")),
    __param(6, (0, tsyringe_1.inject)("ItemHelper")),
    __param(7, (0, tsyringe_1.inject)("ProfileFixerService")),
    __param(8, (0, tsyringe_1.inject)("LocalisationService")),
    __param(9, (0, tsyringe_1.inject)("SeasonalEventService")),
    __param(10, (0, tsyringe_1.inject)("MailSendService")),
    __param(11, (0, tsyringe_1.inject)("PlayerScavGenerator")),
    __param(12, (0, tsyringe_1.inject)("EventOutputHolder")),
    __param(13, (0, tsyringe_1.inject)("TraderHelper")),
    __param(14, (0, tsyringe_1.inject)("DialogueHelper")),
    __param(15, (0, tsyringe_1.inject)("QuestHelper")),
    __param(16, (0, tsyringe_1.inject)("ProfileHelper")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object, typeof (_c = typeof ICloner_1.ICloner !== "undefined" && ICloner_1.ICloner) === "function" ? _c : Object, typeof (_d = typeof TimeUtil_1.TimeUtil !== "undefined" && TimeUtil_1.TimeUtil) === "function" ? _d : Object, typeof (_e = typeof SaveServer_1.SaveServer !== "undefined" && SaveServer_1.SaveServer) === "function" ? _e : Object, typeof (_f = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _f : Object, typeof (_g = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _g : Object, typeof (_h = typeof ProfileFixerService_1.ProfileFixerService !== "undefined" && ProfileFixerService_1.ProfileFixerService) === "function" ? _h : Object, typeof (_j = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _j : Object, typeof (_k = typeof SeasonalEventService_1.SeasonalEventService !== "undefined" && SeasonalEventService_1.SeasonalEventService) === "function" ? _k : Object, typeof (_l = typeof MailSendService_1.MailSendService !== "undefined" && MailSendService_1.MailSendService) === "function" ? _l : Object, typeof (_m = typeof PlayerScavGenerator_1.PlayerScavGenerator !== "undefined" && PlayerScavGenerator_1.PlayerScavGenerator) === "function" ? _m : Object, typeof (_o = typeof EventOutputHolder_1.EventOutputHolder !== "undefined" && EventOutputHolder_1.EventOutputHolder) === "function" ? _o : Object, typeof (_p = typeof TraderHelper_1.TraderHelper !== "undefined" && TraderHelper_1.TraderHelper) === "function" ? _p : Object, typeof (_q = typeof DialogueHelper_1.DialogueHelper !== "undefined" && DialogueHelper_1.DialogueHelper) === "function" ? _q : Object, typeof (_r = typeof QuestHelper_1.QuestHelper !== "undefined" && QuestHelper_1.QuestHelper) === "function" ? _r : Object, typeof (_s = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _s : Object])
], MyCustomProfileController);
//# sourceMappingURL=MyCustomProfileController.js.map
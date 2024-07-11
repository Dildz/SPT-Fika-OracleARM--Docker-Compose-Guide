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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyCustomQuestController = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const ItemHelper_1 = require("/snapshot/project/obj/helpers/ItemHelper");
const ILogger_1 = require("/snapshot/project/obj/models/spt/utils/ILogger");
const ConfigServer_1 = require("/snapshot/project/obj/servers/ConfigServer");
const DatabaseService_1 = require("/snapshot/project/obj/services/DatabaseService");
const LocalisationService_1 = require("/snapshot/project/obj/services/LocalisationService");
const ICloner_1 = require("/snapshot/project/obj/utils/cloners/ICloner");
const DialogueHelper_1 = require("/snapshot/project/obj/helpers/DialogueHelper");
const ProfileHelper_1 = require("/snapshot/project/obj/helpers/ProfileHelper");
const QuestConditionHelper_1 = require("/snapshot/project/obj/helpers/QuestConditionHelper");
const QuestHelper_1 = require("/snapshot/project/obj/helpers/QuestHelper");
const TraderHelper_1 = require("/snapshot/project/obj/helpers/TraderHelper");
const QuestStatus_1 = require("/snapshot/project/obj/models/enums/QuestStatus");
const EventOutputHolder_1 = require("/snapshot/project/obj/routers/EventOutputHolder");
const LocaleService_1 = require("/snapshot/project/obj/services/LocaleService");
const MailSendService_1 = require("/snapshot/project/obj/services/MailSendService");
const PlayerService_1 = require("/snapshot/project/obj/services/PlayerService");
const HttpResponseUtil_1 = require("/snapshot/project/obj/utils/HttpResponseUtil");
const TimeUtil_1 = require("/snapshot/project/obj/utils/TimeUtil");
const QuestController_1 = require("/snapshot/project/obj/controllers/QuestController");
const SeasonalEventService_1 = require("/snapshot/project/obj/services/SeasonalEventService");
/** Handle profile related client events */
let MyCustomQuestController = class MyCustomQuestController extends QuestController_1.QuestController {
    logger;
    timeUtil;
    httpResponseUtil;
    eventOutputHolder;
    databaseService;
    itemHelper;
    dialogueHelper;
    mailSendService;
    profileHelper;
    traderHelper;
    questHelper;
    questConditionHelper;
    playerService;
    localeService;
    seasonalEventService;
    localisationService;
    configServer;
    cloner;
    constructor(logger, timeUtil, httpResponseUtil, eventOutputHolder, databaseService, itemHelper, dialogueHelper, mailSendService, profileHelper, traderHelper, questHelper, questConditionHelper, playerService, localeService, seasonalEventService, localisationService, configServer, cloner) {
        // Pass the parent class (QuestController) the dependencies it needs to work
        super(logger, timeUtil, httpResponseUtil, eventOutputHolder, databaseService, itemHelper, dialogueHelper, mailSendService, profileHelper, traderHelper, questHelper, questConditionHelper, playerService, localeService, seasonalEventService, localisationService, configServer, cloner);
        this.logger = logger;
        this.timeUtil = timeUtil;
        this.httpResponseUtil = httpResponseUtil;
        this.eventOutputHolder = eventOutputHolder;
        this.databaseService = databaseService;
        this.itemHelper = itemHelper;
        this.dialogueHelper = dialogueHelper;
        this.mailSendService = mailSendService;
        this.profileHelper = profileHelper;
        this.traderHelper = traderHelper;
        this.questHelper = questHelper;
        this.questConditionHelper = questConditionHelper;
        this.playerService = playerService;
        this.localeService = localeService;
        this.seasonalEventService = seasonalEventService;
        this.localisationService = localisationService;
        this.configServer = configServer;
        this.cloner = cloner;
    }
    getClientQuests(sessionID) {
        const questsToShowPlayer = [];
        const allQuests = this.questHelper.getQuestsFromDb();
        const profile = this.profileHelper.getPmcProfile(sessionID);
        for (const quest of allQuests) {
            // Player already accepted the quest, show it regardless of status
            const questInProfile = profile.Quests.find((x) => x.qid === quest._id);
            if (questInProfile) {
                quest.sptStatus = questInProfile.status;
                questsToShowPlayer.push(quest);
                continue;
            }
            // Filter out bear quests for usec and vice versa
            if (this.questHelper.questIsForOtherSide(profile.Info.Side, quest._id)) {
                continue;
            }
            if (!this.questHelper.showEventQuestToPlayer(quest._id)) {
                continue;
            }
            // Don't add quests that have a level higher than the user's
            if (!this.playerLevelFulfillsQuestRequirement(quest, profile.Info.Level)) {
                continue;
            }
            // Player can use trader mods then remove them, leaving quests behind
            const trader = profile.TradersInfo[quest.traderId];
            if (!trader) {
                this.logger.debug(`Unable to show quest: ${quest.QuestName} as its for a trader: ${quest.traderId} that no longer exists.`);
                continue;
            }
            const questRequirements = this.questConditionHelper.getQuestConditions(quest.conditions.AvailableForStart);
            const loyaltyRequirements = this.questConditionHelper.getLoyaltyConditions(quest.conditions.AvailableForStart);
            const standingRequirements = this.questConditionHelper.getStandingConditions(quest.conditions.AvailableForStart);
            // Quest has no conditions, standing or loyalty conditions, add to visible quest list
            if (questRequirements.length === 0
                && loyaltyRequirements.length === 0
                && standingRequirements.length === 0) {
                quest.sptStatus = QuestStatus_1.QuestStatus.AvailableForStart;
                questsToShowPlayer.push(quest);
                continue;
            }
            // Check the status of each quest condition, if any are not completed
            // then this quest should not be visible
            let haveCompletedPreviousQuest = true;
            for (const conditionToFulfil of questRequirements) {
                // If the previous quest isn't in the user profile, it hasn't been completed or started
                const prerequisiteQuest = profile.Quests.find((profileQuest) => conditionToFulfil.target.includes(profileQuest.qid));
                if (!prerequisiteQuest) {
                    haveCompletedPreviousQuest = false;
                    break;
                }
                // Prereq does not have its status requirement fulfilled
                // Some bsg status ids are strings, MUST convert to number before doing includes check
                if (!conditionToFulfil.status.map((status) => Number(status)).includes(prerequisiteQuest.status)) {
                    haveCompletedPreviousQuest = false;
                    break;
                }
                // Has a wait timer
                if (conditionToFulfil.availableAfter > 0) {
                    // Compare current time to unlock time for previous quest
                    const previousQuestCompleteTime = prerequisiteQuest.statusTimers[prerequisiteQuest.status];
                    const unlockTime = previousQuestCompleteTime + conditionToFulfil.availableAfter;
                    if (unlockTime > this.timeUtil.getTimestamp()) {
                        this.logger.debug(`Quest ${quest.QuestName} is locked for another ${unlockTime - this.timeUtil.getTimestamp()} seconds`);
                    }
                }
            }
            // Previous quest not completed, skip
            if (!haveCompletedPreviousQuest) {
                continue;
            }
            let passesLoyaltyRequirements = true;
            for (const condition of loyaltyRequirements) {
                if (!this.questHelper.traderLoyaltyLevelRequirementCheck(condition, profile)) {
                    passesLoyaltyRequirements = false;
                    break;
                }
            }
            let passesStandingRequirements = true;
            for (const condition of standingRequirements) {
                if (!this.questHelper.traderStandingRequirementCheck(condition, profile)) {
                    passesStandingRequirements = false;
                    break;
                }
            }
            if (haveCompletedPreviousQuest && passesLoyaltyRequirements && passesStandingRequirements) {
                quest.sptStatus = QuestStatus_1.QuestStatus.AvailableForStart;
                questsToShowPlayer.push(quest);
            }
        }
        return questsToShowPlayer;
    }
};
exports.MyCustomQuestController = MyCustomQuestController;
exports.MyCustomQuestController = MyCustomQuestController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("TimeUtil")),
    __param(2, (0, tsyringe_1.inject)("HttpResponseUtil")),
    __param(3, (0, tsyringe_1.inject)("EventOutputHolder")),
    __param(4, (0, tsyringe_1.inject)("DatabaseService")),
    __param(5, (0, tsyringe_1.inject)("ItemHelper")),
    __param(6, (0, tsyringe_1.inject)("DialogueHelper")),
    __param(7, (0, tsyringe_1.inject)("MailSendService")),
    __param(8, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(9, (0, tsyringe_1.inject)("TraderHelper")),
    __param(10, (0, tsyringe_1.inject)("QuestHelper")),
    __param(11, (0, tsyringe_1.inject)("QuestConditionHelper")),
    __param(12, (0, tsyringe_1.inject)("PlayerService")),
    __param(13, (0, tsyringe_1.inject)("LocaleService")),
    __param(14, (0, tsyringe_1.inject)("SeasonalEventService")),
    __param(15, (0, tsyringe_1.inject)("LocalisationService")),
    __param(16, (0, tsyringe_1.inject)("ConfigServer")),
    __param(17, (0, tsyringe_1.inject)("PrimaryCloner")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof TimeUtil_1.TimeUtil !== "undefined" && TimeUtil_1.TimeUtil) === "function" ? _b : Object, typeof (_c = typeof HttpResponseUtil_1.HttpResponseUtil !== "undefined" && HttpResponseUtil_1.HttpResponseUtil) === "function" ? _c : Object, typeof (_d = typeof EventOutputHolder_1.EventOutputHolder !== "undefined" && EventOutputHolder_1.EventOutputHolder) === "function" ? _d : Object, typeof (_e = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _e : Object, typeof (_f = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _f : Object, typeof (_g = typeof DialogueHelper_1.DialogueHelper !== "undefined" && DialogueHelper_1.DialogueHelper) === "function" ? _g : Object, typeof (_h = typeof MailSendService_1.MailSendService !== "undefined" && MailSendService_1.MailSendService) === "function" ? _h : Object, typeof (_j = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _j : Object, typeof (_k = typeof TraderHelper_1.TraderHelper !== "undefined" && TraderHelper_1.TraderHelper) === "function" ? _k : Object, typeof (_l = typeof QuestHelper_1.QuestHelper !== "undefined" && QuestHelper_1.QuestHelper) === "function" ? _l : Object, typeof (_m = typeof QuestConditionHelper_1.QuestConditionHelper !== "undefined" && QuestConditionHelper_1.QuestConditionHelper) === "function" ? _m : Object, typeof (_o = typeof PlayerService_1.PlayerService !== "undefined" && PlayerService_1.PlayerService) === "function" ? _o : Object, typeof (_p = typeof LocaleService_1.LocaleService !== "undefined" && LocaleService_1.LocaleService) === "function" ? _p : Object, typeof (_q = typeof SeasonalEventService_1.SeasonalEventService !== "undefined" && SeasonalEventService_1.SeasonalEventService) === "function" ? _q : Object, typeof (_r = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _r : Object, typeof (_s = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _s : Object, typeof (_t = typeof ICloner_1.ICloner !== "undefined" && ICloner_1.ICloner) === "function" ? _t : Object])
], MyCustomQuestController);
//# sourceMappingURL=MyCustomQuestController.js.map
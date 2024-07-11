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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyCustomQuestHelper = void 0;
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
const TimeUtil_1 = require("/snapshot/project/obj/utils/TimeUtil");
const SeasonalEventService_1 = require("/snapshot/project/obj/services/SeasonalEventService");
const SeasonalEventType_1 = require("/snapshot/project/obj/models/enums/SeasonalEventType");
const PaymentHelper_1 = require("/snapshot/project/obj/helpers/PaymentHelper");
const PresetHelper_1 = require("/snapshot/project/obj/helpers/PresetHelper");
const RagfairServerHelper_1 = require("/snapshot/project/obj/helpers/RagfairServerHelper");
const HashUtil_1 = require("/snapshot/project/obj/utils/HashUtil");
/** Handle profile related client events */
let MyCustomQuestHelper = class MyCustomQuestHelper extends QuestHelper_1.QuestHelper {
    logger;
    timeUtil;
    hashUtil;
    itemHelper;
    databaseService;
    questConditionHelper;
    eventOutputHolder;
    localeService;
    ragfairServerHelper;
    dialogueHelper;
    profileHelper;
    paymentHelper;
    localisationService;
    seasonalEventService;
    traderHelper;
    presetHelper;
    mailSendService;
    configServer;
    cloner;
    constructor(logger, timeUtil, hashUtil, itemHelper, databaseService, questConditionHelper, eventOutputHolder, localeService, ragfairServerHelper, dialogueHelper, profileHelper, paymentHelper, localisationService, seasonalEventService, traderHelper, presetHelper, mailSendService, configServer, cloner) {
        // Pass the parent class (QuestHelper) the dependencies it needs to work
        super(logger, timeUtil, hashUtil, itemHelper, databaseService, questConditionHelper, eventOutputHolder, localeService, ragfairServerHelper, dialogueHelper, profileHelper, paymentHelper, localisationService, traderHelper, presetHelper, mailSendService, configServer, cloner);
        this.logger = logger;
        this.timeUtil = timeUtil;
        this.hashUtil = hashUtil;
        this.itemHelper = itemHelper;
        this.databaseService = databaseService;
        this.questConditionHelper = questConditionHelper;
        this.eventOutputHolder = eventOutputHolder;
        this.localeService = localeService;
        this.ragfairServerHelper = ragfairServerHelper;
        this.dialogueHelper = dialogueHelper;
        this.profileHelper = profileHelper;
        this.paymentHelper = paymentHelper;
        this.localisationService = localisationService;
        this.seasonalEventService = seasonalEventService;
        this.traderHelper = traderHelper;
        this.presetHelper = presetHelper;
        this.mailSendService = mailSendService;
        this.configServer = configServer;
        this.cloner = cloner;
    }
    getNewlyAccessibleQuestsWhenStartingQuest(startedQuestId, sessionID) {
        // Get quest acceptance data from profile
        const profile = this.profileHelper.getPmcProfile(sessionID);
        const startedQuestInProfile = profile.Quests.find((profileQuest) => profileQuest.qid === startedQuestId);
        // Get quests that
        const eligibleQuests = this.getQuestsFromDb().filter((quest) => {
            // Quest is accessible to player when the accepted quest passed into param is started
            // e.g. Quest A passed in, quest B is looped over and has requirement of A to be started, include it
            const acceptedQuestCondition = quest.conditions.AvailableForStart.find((condition) => {
                return (condition.conditionType === "Quest"
                    && condition.target?.includes(startedQuestId)
                    && condition.status?.includes(QuestStatus_1.QuestStatus.Started));
            });
            // Not found, skip quest
            if (!acceptedQuestCondition) {
                return false;
            }
            // Skip locked event quests
            if (!this.showEventQuestToPlayer(quest._id)) {
                return false;
            }
            // Skip quest if its flagged as for other side
            if (this.questIsForOtherSide(profile.Info.Side, quest._id)) {
                return false;
            }
            const standingRequirements = this.questConditionHelper.getStandingConditions(quest.conditions.AvailableForStart);
            for (const condition of standingRequirements) {
                if (!this.traderStandingRequirementCheck(condition, profile)) {
                    return false;
                }
            }
            const loyaltyRequirements = this.questConditionHelper.getLoyaltyConditions(quest.conditions.AvailableForStart);
            for (const condition of loyaltyRequirements) {
                if (!this.traderLoyaltyLevelRequirementCheck(condition, profile)) {
                    return false;
                }
            }
            // Include if quest found in profile and is started or ready to hand in
            return (startedQuestInProfile
                && [QuestStatus_1.QuestStatus.Started, QuestStatus_1.QuestStatus.AvailableForFinish].includes(startedQuestInProfile.status));
        });
        return this.getQuestsWithOnlyLevelRequirementStartCondition(eligibleQuests);
    }
    /**
     * Should a seasonal/event quest be shown to the player
     * @param questId Quest to check
     * @returns true = show to player
     */
    showEventQuestToPlayer(questId) {
        const isChristmasEventActive = this.seasonalEventService.christmasEventEnabled();
        const isHalloweenEventActive = this.seasonalEventService.halloweenEventEnabled();
        // Not christmas + quest is for christmas
        if (!isChristmasEventActive
            && this.seasonalEventService.isQuestRelatedToEvent(questId, SeasonalEventType_1.SeasonalEventType.CHRISTMAS)) {
            return false;
        }
        // Not halloween + quest is for halloween
        if (!isHalloweenEventActive
            && this.seasonalEventService.isQuestRelatedToEvent(questId, SeasonalEventType_1.SeasonalEventType.HALLOWEEN)) {
            return false;
        }
        // Should non-season event quests be shown to player
        if (!this.questConfig.showNonSeasonalEventQuests
            && this.seasonalEventService.isQuestRelatedToEvent(questId, SeasonalEventType_1.SeasonalEventType.NONE)) {
            return false;
        }
        return true;
    }
};
exports.MyCustomQuestHelper = MyCustomQuestHelper;
exports.MyCustomQuestHelper = MyCustomQuestHelper = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("TimeUtil")),
    __param(2, (0, tsyringe_1.inject)("HashUtil")),
    __param(3, (0, tsyringe_1.inject)("ItemHelper")),
    __param(4, (0, tsyringe_1.inject)("DatabaseService")),
    __param(5, (0, tsyringe_1.inject)("QuestConditionHelper")),
    __param(6, (0, tsyringe_1.inject)("EventOutputHolder")),
    __param(7, (0, tsyringe_1.inject)("LocaleService")),
    __param(8, (0, tsyringe_1.inject)("RagfairServerHelper")),
    __param(9, (0, tsyringe_1.inject)("DialogueHelper")),
    __param(10, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(11, (0, tsyringe_1.inject)("PaymentHelper")),
    __param(12, (0, tsyringe_1.inject)("LocalisationService")),
    __param(13, (0, tsyringe_1.inject)("SeasonalEventService")),
    __param(14, (0, tsyringe_1.inject)("TraderHelper")),
    __param(15, (0, tsyringe_1.inject)("PresetHelper")),
    __param(16, (0, tsyringe_1.inject)("MailSendService")),
    __param(17, (0, tsyringe_1.inject)("ConfigServer")),
    __param(18, (0, tsyringe_1.inject)("PrimaryCloner")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof TimeUtil_1.TimeUtil !== "undefined" && TimeUtil_1.TimeUtil) === "function" ? _b : Object, typeof (_c = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _c : Object, typeof (_d = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _d : Object, typeof (_e = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _e : Object, typeof (_f = typeof QuestConditionHelper_1.QuestConditionHelper !== "undefined" && QuestConditionHelper_1.QuestConditionHelper) === "function" ? _f : Object, typeof (_g = typeof EventOutputHolder_1.EventOutputHolder !== "undefined" && EventOutputHolder_1.EventOutputHolder) === "function" ? _g : Object, typeof (_h = typeof LocaleService_1.LocaleService !== "undefined" && LocaleService_1.LocaleService) === "function" ? _h : Object, typeof (_j = typeof RagfairServerHelper_1.RagfairServerHelper !== "undefined" && RagfairServerHelper_1.RagfairServerHelper) === "function" ? _j : Object, typeof (_k = typeof DialogueHelper_1.DialogueHelper !== "undefined" && DialogueHelper_1.DialogueHelper) === "function" ? _k : Object, typeof (_l = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _l : Object, typeof (_m = typeof PaymentHelper_1.PaymentHelper !== "undefined" && PaymentHelper_1.PaymentHelper) === "function" ? _m : Object, typeof (_o = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _o : Object, typeof (_p = typeof SeasonalEventService_1.SeasonalEventService !== "undefined" && SeasonalEventService_1.SeasonalEventService) === "function" ? _p : Object, typeof (_q = typeof TraderHelper_1.TraderHelper !== "undefined" && TraderHelper_1.TraderHelper) === "function" ? _q : Object, typeof (_r = typeof PresetHelper_1.PresetHelper !== "undefined" && PresetHelper_1.PresetHelper) === "function" ? _r : Object, typeof (_s = typeof MailSendService_1.MailSendService !== "undefined" && MailSendService_1.MailSendService) === "function" ? _s : Object, typeof (_t = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _t : Object, typeof (_u = typeof ICloner_1.ICloner !== "undefined" && ICloner_1.ICloner) === "function" ? _u : Object])
], MyCustomQuestHelper);
//# sourceMappingURL=MyCustomQuestHelper.js.map
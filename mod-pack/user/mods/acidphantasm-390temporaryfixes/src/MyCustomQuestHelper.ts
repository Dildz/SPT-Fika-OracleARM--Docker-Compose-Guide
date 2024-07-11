import { inject, injectable } from "tsyringe";

import { ItemHelper } from "@spt/helpers/ItemHelper";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { DatabaseService } from "@spt/services/DatabaseService";
import { LocalisationService } from "@spt/services/LocalisationService";
import { ICloner } from "@spt/utils/cloners/ICloner";
import { DialogueHelper } from "@spt/helpers/DialogueHelper";
import { ProfileHelper } from "@spt/helpers/ProfileHelper";
import { QuestConditionHelper } from "@spt/helpers/QuestConditionHelper";
import { QuestHelper } from "@spt/helpers/QuestHelper";
import { TraderHelper } from "@spt/helpers/TraderHelper";
import { IPmcData } from "@spt/models/eft/common/IPmcData";
import { IQuest } from "@spt/models/eft/common/tables/IQuest";
import { QuestStatus } from "@spt/models/enums/QuestStatus";
import { EventOutputHolder } from "@spt/routers/EventOutputHolder";
import { LocaleService } from "@spt/services/LocaleService";
import { MailSendService } from "@spt/services/MailSendService";
import { TimeUtil } from "@spt/utils/TimeUtil";
import { SeasonalEventService } from "@spt/services/SeasonalEventService";
import { SeasonalEventType } from "@spt/models/enums/SeasonalEventType";
import { PaymentHelper } from "@spt/helpers/PaymentHelper";
import { PresetHelper } from "@spt/helpers/PresetHelper";
import { RagfairServerHelper } from "@spt/helpers/RagfairServerHelper";
import { HashUtil } from "@spt/utils/HashUtil";

/** Handle profile related client events */
@injectable()
export class MyCustomQuestHelper extends QuestHelper
{
    constructor(
        @inject("PrimaryLogger") protected logger: ILogger,
        @inject("TimeUtil") protected timeUtil: TimeUtil,
        @inject("HashUtil") protected hashUtil: HashUtil,
        @inject("ItemHelper") protected itemHelper: ItemHelper,
        @inject("DatabaseService") protected databaseService: DatabaseService,
        @inject("QuestConditionHelper") protected questConditionHelper: QuestConditionHelper,
        @inject("EventOutputHolder") protected eventOutputHolder: EventOutputHolder,
        @inject("LocaleService") protected localeService: LocaleService,
        @inject("RagfairServerHelper") protected ragfairServerHelper: RagfairServerHelper,
        @inject("DialogueHelper") protected dialogueHelper: DialogueHelper,
        @inject("ProfileHelper") protected profileHelper: ProfileHelper,
        @inject("PaymentHelper") protected paymentHelper: PaymentHelper,
        @inject("LocalisationService") protected localisationService: LocalisationService,
        @inject("SeasonalEventService") protected seasonalEventService: SeasonalEventService,
        @inject("TraderHelper") protected traderHelper: TraderHelper,
        @inject("PresetHelper") protected presetHelper: PresetHelper,
        @inject("MailSendService") protected mailSendService: MailSendService,
        @inject("ConfigServer") protected configServer: ConfigServer,
        @inject("PrimaryCloner") protected cloner: ICloner,
    )
    {
        // Pass the parent class (QuestHelper) the dependencies it needs to work
        super(logger, 
            timeUtil, 
            hashUtil, 
            itemHelper, 
            databaseService, 
            questConditionHelper, 
            eventOutputHolder, 
            localeService, 
            ragfairServerHelper, 
            dialogueHelper, 
            profileHelper, 
            paymentHelper, 
            localisationService,
            traderHelper,
            presetHelper,
            mailSendService,
            configServer,
            cloner,
        );
    }

    public override getNewlyAccessibleQuestsWhenStartingQuest(startedQuestId: string, sessionID: string): IQuest[]
    {
        // Get quest acceptance data from profile
        const profile: IPmcData = this.profileHelper.getPmcProfile(sessionID);
        const startedQuestInProfile = profile.Quests.find((profileQuest) => profileQuest.qid === startedQuestId);

        // Get quests that
        const eligibleQuests = this.getQuestsFromDb().filter((quest) =>
        {
            // Quest is accessible to player when the accepted quest passed into param is started
            // e.g. Quest A passed in, quest B is looped over and has requirement of A to be started, include it
            const acceptedQuestCondition = quest.conditions.AvailableForStart.find((condition) =>
            {
                return (
                    condition.conditionType === "Quest"
                    && condition.target?.includes(startedQuestId)
                    && condition.status?.includes(QuestStatus.Started)
                );
            });

            // Not found, skip quest
            if (!acceptedQuestCondition)
            {
                return false;
            }

            // Skip locked event quests
            if (!this.showEventQuestToPlayer(quest._id))
            {
                return false;
            }

            // Skip quest if its flagged as for other side
            if (this.questIsForOtherSide(profile.Info.Side, quest._id))
            {
                return false;
            }

            const standingRequirements = this.questConditionHelper.getStandingConditions(
                quest.conditions.AvailableForStart,
            );
            for (const condition of standingRequirements)
            {
                if (!this.traderStandingRequirementCheck(condition, profile))
                {
                    return false;
                }
            }

            const loyaltyRequirements = this.questConditionHelper.getLoyaltyConditions(
                quest.conditions.AvailableForStart,
            );
            for (const condition of loyaltyRequirements)
            {
                if (!this.traderLoyaltyLevelRequirementCheck(condition, profile))
                {
                    return false;
                }
            }

            // Include if quest found in profile and is started or ready to hand in
            return (
                startedQuestInProfile
                && [QuestStatus.Started, QuestStatus.AvailableForFinish].includes(startedQuestInProfile.status)
            );
        });

        return this.getQuestsWithOnlyLevelRequirementStartCondition(eligibleQuests);
    }

    /**
     * Should a seasonal/event quest be shown to the player
     * @param questId Quest to check
     * @returns true = show to player
     */
    public showEventQuestToPlayer(questId: string): boolean
    {
        const isChristmasEventActive = this.seasonalEventService.christmasEventEnabled();
        const isHalloweenEventActive = this.seasonalEventService.halloweenEventEnabled();

        // Not christmas + quest is for christmas
        if (
            !isChristmasEventActive
            && this.seasonalEventService.isQuestRelatedToEvent(questId, SeasonalEventType.CHRISTMAS)
        )
        {
            return false;
        }

        // Not halloween + quest is for halloween
        if (
            !isHalloweenEventActive
            && this.seasonalEventService.isQuestRelatedToEvent(questId, SeasonalEventType.HALLOWEEN)
        )
        {
            return false;
        }

        // Should non-season event quests be shown to player
        if (
            !this.questConfig.showNonSeasonalEventQuests
            && this.seasonalEventService.isQuestRelatedToEvent(questId, SeasonalEventType.NONE)
        )
        {
            return false;
        }

        return true;
    }


}

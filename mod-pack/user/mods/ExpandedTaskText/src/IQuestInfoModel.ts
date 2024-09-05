

export interface IQuestInfoModel
{
    wikiLink: string;
    id: string;
    kappaRequired: boolean;
    lightkeeperRequired: boolean;
    objectives: IObjective[];
}

export interface IObjective
{
    id: string;
    requiredKeys: Record<string, string>[] | undefined;
}
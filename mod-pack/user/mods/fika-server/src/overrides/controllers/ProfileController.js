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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileControllerOverride = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const ProfileHelper_1 = require("/snapshot/project/obj/helpers/ProfileHelper");
const Override_1 = require("../../di/Override");
const FikaConfig_1 = require("../../utils/FikaConfig");
let ProfileControllerOverride = class ProfileControllerOverride extends Override_1.Override {
    profileHelper;
    fikaConfig;
    constructor(profileHelper, fikaConfig) {
        super();
        this.profileHelper = profileHelper;
        this.fikaConfig = fikaConfig;
    }
    execute(container) {
        const fikaConfig = this.fikaConfig.getConfig();
        container.afterResolution("ProfileController", (_t, result) => {
            if (!fikaConfig.server.launcherListAllProfiles) {
                result.getMiniProfiles = () => {
                    return [];
                };
            }
            result.getFriends = (info, _sessionID) => {
                const searchNicknameLowerCase = info.nickname.toLowerCase();
                const profiles = this.profileHelper.getProfiles();
                const matches = [];
                for (const profile of Object.values(profiles)) {
                    if (profile.characters?.pmc?.Info) {
                        if (profile.characters.pmc.Info.Nickname.toLowerCase().startsWith(searchNicknameLowerCase)) {
                            matches.push({
                                _id: profile.characters.pmc._id,
                                aid: profile.characters.pmc.aid,
                                Info: {
                                    Nickname: profile.characters.pmc.Info.Nickname,
                                    Side: profile.characters.pmc.Info.Side,
                                    Level: profile.characters.pmc.Info.Level,
                                    MemberCategory: profile.characters.pmc.Info.MemberCategory,
                                },
                            });
                        }
                    }
                }
                return matches;
            };
            result.getOtherProfile = (sessionId, request) => {
                const profiles = this.profileHelper.getProfiles();
                // default to player profile
                let profileId = sessionId;
                for (const profile of Object.values(profiles)) {
                    if (profile.characters.pmc.aid === Number(request.accountId)) {
                        profileId = profile.characters.pmc._id;
                        break;
                    }
                }
                const player = this.profileHelper.getFullProfile(profileId);
                const playerPmc = player.characters.pmc;
                const playerScav = player.characters.scav;
                return {
                    id: playerPmc._id,
                    aid: playerPmc.aid,
                    info: {
                        nickname: playerPmc.Info.Nickname,
                        side: playerPmc.Info.Side,
                        experience: playerPmc.Info.Experience,
                        memberCategory: playerPmc.Info.MemberCategory,
                        bannedState: playerPmc.Info.BannedState,
                        bannedUntil: playerPmc.Info.BannedUntil,
                        registrationDate: playerPmc.Info.RegistrationDate,
                    },
                    customization: {
                        head: playerPmc.Customization.Head,
                        body: playerPmc.Customization.Body,
                        feet: playerPmc.Customization.Feet,
                        hands: playerPmc.Customization.Hands,
                    },
                    skills: playerPmc.Skills,
                    equipment: {
                        // Default inventory tpl
                        Id: playerPmc.Inventory.items.find((x) => x._tpl === "55d7217a4bdc2d86028b456d")._id,
                        Items: playerPmc.Inventory.items,
                    },
                    achievements: playerPmc.Achievements,
                    favoriteItems: playerPmc.Inventory.favoriteItems ?? [],
                    pmcStats: {
                        eft: {
                            totalInGameTime: playerPmc.Stats.Eft.TotalInGameTime,
                            overAllCounters: playerPmc.Stats.Eft.OverallCounters,
                        },
                    },
                    scavStats: {
                        eft: {
                            totalInGameTime: playerScav.Stats.Eft.TotalInGameTime,
                            overAllCounters: playerScav.Stats.Eft.OverallCounters,
                        },
                    },
                };
            };
        }, { frequency: "Always" });
    }
};
exports.ProfileControllerOverride = ProfileControllerOverride;
exports.ProfileControllerOverride = ProfileControllerOverride = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(1, (0, tsyringe_1.inject)("FikaConfig")),
    __metadata("design:paramtypes", [typeof (_a = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _a : Object, typeof (_b = typeof FikaConfig_1.FikaConfig !== "undefined" && FikaConfig_1.FikaConfig) === "function" ? _b : Object])
], ProfileControllerOverride);
//# sourceMappingURL=ProfileController.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const tsyringe_1 = require("/snapshot/project/node_modules/tsyringe");
const FikaConfig_1 = require("../utils/FikaConfig");
const Overrider_1 = require("../overrides/Overrider");
const DialogueCallbacks_1 = require("../overrides/callbacks/DialogueCallbacks");
const LocationCallbacks_1 = require("../overrides/callbacks/LocationCallbacks");
const DialogueController_1 = require("../overrides/controllers/DialogueController");
const ProfileController_1 = require("../overrides/controllers/ProfileController");
const LauncherBackground_1 = require("../overrides/other/LauncherBackground");
const Locales_1 = require("../overrides/other/Locales");
const HttpRouter_1 = require("../overrides/routers/HttpRouter");
const AchievementController_1 = require("../overrides/controllers/AchievementController");
const FikaDatabaseService_1 = require("../overrides/services/FikaDatabaseService");
const FikaMatchService_1 = require("../services/FikaMatchService");
const FikaFriendRequestsCacheService_1 = require("../services/cache/FikaFriendRequestsCacheService");
const FikaPlayerRelationsCacheService_1 = require("../services/cache/FikaPlayerRelationsCacheService");
const FikaClientModHashesHelper_1 = require("../helpers/FikaClientModHashesHelper");
const FikaFriendRequestsHelper_1 = require("../helpers/FikaFriendRequestsHelper");
const FikaPlayerRelationsHelper_1 = require("../helpers/FikaPlayerRelationsHelper");
const FikaClientController_1 = require("../controllers/FikaClientController");
const FikaDialogueController_1 = require("../controllers/FikaDialogueController");
const FikaLocationController_1 = require("../controllers/FikaLocationController");
const FikaRaidController_1 = require("../controllers/FikaRaidController");
const FikaSendItemController_1 = require("../controllers/FikaSendItemController");
const FikaUpdateController_1 = require("../controllers/FikaUpdateController");
const FikaAchievementController_1 = require("../controllers/FikaAchievementController");
const FikaClientCallbacks_1 = require("../callbacks/FikaClientCallbacks");
const FikaLocationCallbacks_1 = require("../callbacks/FikaLocationCallbacks");
const FikaRaidCallbacks_1 = require("../callbacks/FikaRaidCallbacks");
const FikaSendItemCallbacks_1 = require("../callbacks/FikaSendItemCallbacks");
const FikaUpdateCallbacks_1 = require("../callbacks/FikaUpdateCallbacks");
const FikaClientStaticRouter_1 = require("../routers/static/FikaClientStaticRouter");
const FikaLocationStaticRouter_1 = require("../routers/static/FikaLocationStaticRouter");
const FikaRaidStaticRouter_1 = require("../routers/static/FikaRaidStaticRouter");
const FikaSendItemStaticRouter_1 = require("../routers/static/FikaSendItemStaticRouter");
const FikaUpdateStaticRouter_1 = require("../routers/static/FikaUpdateStaticRouter");
const FikaItemEventRouter_1 = require("../routers/item_events/FikaItemEventRouter");
const Fika_1 = require("../Fika");
const FikaServerTools_1 = require("../utils/FikaServerTools");
class Container {
    static register(container) {
        Container.registerUtils(container);
        Container.registerOverrides(container);
        Container.registerServices(container);
        Container.registerHelpers(container);
        Container.registerControllers(container);
        Container.registerCallbacks(container);
        Container.registerRouters(container);
        Container.registerListTypes(container);
        container.register("Fika", Fika_1.Fika, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
    static registerListTypes(container) {
        container.registerType("Overrides", "DialogueCallbacksOverride");
        container.registerType("Overrides", "LocationCallbacksOverride");
        container.registerType("Overrides", "DialogueControllerOverride");
        container.registerType("Overrides", "ProfileControllerOverride");
        container.registerType("Overrides", "HttpRouterOverride");
        container.registerType("Overrides", "LauncherBackgroundOverride");
        container.registerType("Overrides", "LocalesOverride");
        container.registerType("Overrides", "AchievementControllerOverride");
        container.registerType("Overrides", "DatabaseServiceOverride");
        container.registerType("StaticRoutes", "FikaClientStaticRouter");
        container.registerType("StaticRoutes", "FikaLocationStaticRouter");
        container.registerType("StaticRoutes", "FikaRaidStaticRouter");
        container.registerType("StaticRoutes", "FikaSendItemStaticRouter");
        container.registerType("StaticRoutes", "FikaUpdateStaticRouter");
        container.registerType("IERouters", "FikaItemEventRouter");
    }
    static registerUtils(container) {
        container.register("FikaConfig", FikaConfig_1.FikaConfig, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("FikaServerTools", FikaServerTools_1.FikaServerTools, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
    static registerOverrides(container) {
        container.register("DialogueCallbacksOverride", DialogueCallbacks_1.DialogueCallbacksOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("LocationCallbacksOverride", LocationCallbacks_1.LocationCallbacksOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("DialogueControllerOverride", DialogueController_1.DialogueControllerOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("ProfileControllerOverride", ProfileController_1.ProfileControllerOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("HttpRouterOverride", HttpRouter_1.HttpRouterOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("LauncherBackgroundOverride", LauncherBackground_1.LauncherBackgroundOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("LocalesOverride", Locales_1.LocalesOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("Overrider", Overrider_1.Overrider, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("AchievementControllerOverride", AchievementController_1.AchievementControllerOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("DatabaseServiceOverride", FikaDatabaseService_1.DatabaseServiceOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
    static registerServices(container) {
        container.register("FikaMatchService", FikaMatchService_1.FikaMatchService, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("FikaFriendRequestsCacheService", FikaFriendRequestsCacheService_1.FikaFriendRequestsCacheService, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("FikaPlayerRelationsCacheService", FikaPlayerRelationsCacheService_1.FikaPlayerRelationsCacheService, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
    static registerHelpers(container) {
        container.register("FikaClientModHashesHelper", FikaClientModHashesHelper_1.FikaClientModHashesHelper, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("FikaFriendRequestsHelper", FikaFriendRequestsHelper_1.FikaFriendRequestsHelper, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("FikaPlayerRelationsHelper", FikaPlayerRelationsHelper_1.FikaPlayerRelationsHelper, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
    static registerControllers(container) {
        container.register("FikaClientController", { useClass: FikaClientController_1.FikaClientController });
        container.register("FikaDialogueController", { useClass: FikaDialogueController_1.FikaDialogueController });
        container.register("FikaLocationController", { useClass: FikaLocationController_1.FikaLocationController });
        container.register("FikaRaidController", { useClass: FikaRaidController_1.FikaRaidController });
        container.register("FikaSendItemController", { useClass: FikaSendItemController_1.FikaSendItemController });
        container.register("FikaUpdateController", { useClass: FikaUpdateController_1.FikaUpdateController });
        container.register("FikaAchievementController", { useClass: FikaAchievementController_1.FikaAchievementController });
    }
    static registerCallbacks(container) {
        container.register("FikaClientCallbacks", { useClass: FikaClientCallbacks_1.FikaClientCallbacks });
        container.register("FikaLocationCallbacks", { useClass: FikaLocationCallbacks_1.FikaLocationCallbacks });
        container.register("FikaRaidCallbacks", { useClass: FikaRaidCallbacks_1.FikaRaidCallbacks });
        container.register("FikaSendItemCallbacks", { useClass: FikaSendItemCallbacks_1.FikaSendItemCallbacks });
        container.register("FikaUpdateCallbacks", { useClass: FikaUpdateCallbacks_1.FikaUpdateCallbacks });
    }
    static registerRouters(container) {
        container.register("FikaClientStaticRouter", { useClass: FikaClientStaticRouter_1.FikaClientStaticRouter });
        container.register("FikaLocationStaticRouter", { useClass: FikaLocationStaticRouter_1.FikaLocationStaticRouter });
        container.register("FikaRaidStaticRouter", { useClass: FikaRaidStaticRouter_1.FikaRaidStaticRouter });
        container.register("FikaSendItemStaticRouter", { useClass: FikaSendItemStaticRouter_1.FikaSendItemStaticRouter });
        container.register("FikaUpdateStaticRouter", { useClass: FikaUpdateStaticRouter_1.FikaUpdateStaticRouter });
        container.register("FikaItemEventRouter", { useClass: FikaItemEventRouter_1.FikaItemEventRouter });
    }
}
exports.Container = Container;
//# sourceMappingURL=Container.js.map
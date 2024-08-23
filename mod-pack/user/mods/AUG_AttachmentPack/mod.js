"use strict";

let mydb;

class Mod {
    postDBLoad(container) {
        const modLoader = container.resolve("PreSptModLoader");
        const importerUtil = container.resolve("ImporterUtil");
        const db = container.resolve("DatabaseServer").getTables();
        const locales = db.locales.global;
        const items = db.templates.items;
        const handbook = db.templates.handbook.Items;
        const peacekeeper = db.traders["5935c25fb3acc3127c3d8cd9"];

        mydb = importerUtil.loadRecursive(`${modLoader.getModPath("AUG_AttachmentPack")}database/`);

        for (const item in mydb.templates.items) {
            items[item] = mydb.templates.items[item];
        }

        for (const item of mydb.templates.handbook.Items) {
            handbook.push(item);
        }

        for (const item of mydb.traders.assort.assorts.items) {
            peacekeeper.assort.items.push(item);
        }

        for (const bc in mydb.traders.assort.assorts.barter_scheme) {
            peacekeeper.assort.barter_scheme[bc] = mydb.traders.assort.assorts.barter_scheme[bc];
        }

        for (const level in mydb.traders.assort.assorts.loyal_level_items) {
            peacekeeper.assort.loyal_level_items[level] = mydb.traders.assort.assorts.loyal_level_items[level];
        }

        for (const localeID in locales) {
            if (localeID == "en") {
                for (const [itemId, template] of Object.entries(mydb.locales.en.templates)) {
                    for (const [key, value] of Object.entries(template)) {
                        locales[localeID][`${itemId} ${key}`] = value;
                    }
                }
            }
        }

        Mod.addHandguardToFilters(db);
        Mod.addMagazineToFilters(db);
    }

    static addHandguardToFilters(db) {
        const isItemSlotsExist = (item) =>
          item._props && item._props.Slots && item._props.Slots.length > 0;
        const attachmentToAdd = ["handguard_fb20", "handguard_guerilla", "handguard_turaco"];
        const attachmentItemId = "634e61b0767cb15c4601a877";

        for (const item of Object.values(db.templates.items)) {
            if (isItemSlotsExist(item)) {
                for (const slot of item._props.Slots) {
                    if (slot._props.filters.some((filter) => filter.Filter.includes(attachmentItemId))) {
                        slot._props.filters.forEach((filter) => {
                            if (filter.Filter.includes(attachmentItemId)) {
                                filter.Filter.push(...attachmentToAdd);
                            }
                        });
                    }
                }
            }
        }
    }

    static addMagazineToFilters(db) {
        const isItemSlotsExist = (item) =>
          item._props && item._props.Slots && item._props.Slots.length > 0;
        const attachmentToAdd = "mag_aug_60";
        const attachmentItemId = "630e1adbbd357927e4007c09";

        for (const item of Object.values(db.templates.items)) {
            if (isItemSlotsExist(item)) {
                for (const slot of item._props.Slots) {
                    if (slot._props.filters.some((filter) => filter.Filter.includes(attachmentItemId))) {
                        slot._props.filters.forEach((filter) => {
                            if (filter.Filter.includes(attachmentItemId)) {
                                filter.Filter.push(attachmentToAdd);
                            }
                        });
                    }
                }
            }
        }
    }
}

module.exports = { mod: new Mod() };
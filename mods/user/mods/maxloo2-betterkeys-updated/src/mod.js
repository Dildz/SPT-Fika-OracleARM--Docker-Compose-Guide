"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseClasses_1 = require("/snapshot/project/obj/models/enums/BaseClasses");
const LogTextColor_1 = require("/snapshot/project/obj/models/spt/logging/LogTextColor");
const package_json_1 = __importDefault(require("../package.json"));
class Mod {
    modPath = 'user/mods/maxloo2-betterkeys-updated';
    container;
    async postDBLoadAsync(container) {
        this.container = container;
        const vfs = container.resolve('VFS');
        const db = container
            .resolve('DatabaseServer')
            .getTables();
        const config = JSON.parse(vfs.readFile(`${this.modPath}/config/config.json`));
        const github = config.github;
        if (config.enableAutoUpdate) {
            await this.autoUpdate(github, vfs);
            this.main(db, config);
        }
        else {
            this.main(db, config);
        }
    }
    async autoUpdate(github, vfs) {
        const logger = this.container.resolve('WinstonLogger');
        const updatePromises = ['db', 'locales'].map((folderName) => {
            const folderPath = `${this.modPath}/${folderName}`;
            logger.info(`[${package_json_1.default.name}] Checking for updates: ${folderPath}`);
            return Promise.all(vfs.getFiles(folderPath).map((fileName) => {
                const localFile = JSON.parse(vfs.readFile(`${folderPath}/${fileName}`));
                const _version = localFile._version;
                return fetch(`${github}/server/${folderName}/${fileName}`)
                    .then((response) => response.json())
                    .then((targetFile) => {
                    const targetVersion = targetFile._version;
                    if (targetVersion !== _version) {
                        logger.warning(`[${package_json_1.default.name}] Updating ${folderName}/${fileName} (Local: ${_version}, GitHub: ${targetVersion})`);
                        vfs.writeFile(`${folderPath}/${fileName}`, JSON.stringify(targetFile, null, 2));
                    }
                });
            }));
        });
        return await Promise.all(updatePromises)
            .then(() => {
            logger.success(`[${package_json_1.default.name}] Finished checking for updates.`);
        })
            .catch((error) => {
            logger.error(`[${package_json_1.default.name}] Error checking for updates: ${error}`);
        });
    }
    main(db, config) {
        const vfs = this.container.resolve('VFS');
        const logger = this.container.resolve('WinstonLogger');
        const ItemHelper = this.container.resolve('ItemHelper');
        const _constants = JSON.parse(vfs.readFile(`${this.modPath}/db/_constants.json`));
        const keysWithInfo = [];
        const mapIds = _constants.maps;
        mapIds.forEach(({ name: mapName, id: mapId }) => {
            const keyInfoFile = JSON.parse(vfs.readFile(`${this.modPath}/db/${mapName}.json`));
            for (const keyId in keyInfoFile.Keys) {
                const keyItem = db.templates.items[keyId];
                if (config.backgroundColor) {
                    if (config.yellowMarkedKeys &&
                        _constants.markedKeys.includes(keyId)) {
                        keyItem._props.BackgroundColor = 'yellow';
                    }
                    else {
                        const color = config.backgroundColors[db.locales.global['en'][`${mapId} Name`]];
                        keyItem._props.BackgroundColor = color;
                    }
                }
                if (config.descriptionInfo) {
                    for (const lang in db.locales.global) {
                        const description = db.locales.global[lang][`${keyId} Description`];
                        let modLocale;
                        if (!vfs.exists(`${this.modPath}/locales/${lang}.json`)) {
                            modLocale = JSON.parse(vfs.readFile(`${this.modPath}/locales/en.json`));
                        }
                        else {
                            modLocale = JSON.parse(vfs.readFile(`${this.modPath}/locales/${lang}.json`));
                        }
                        const dbLangLocale = db.locales.global[lang];
                        const obj = {
                            config,
                            keyId,
                            keyInfoFile,
                            modLocale,
                            dbLangLocale,
                        };
                        const keyInfo = `${modLocale.mapString}: ${dbLangLocale[`${mapId} Name`]}.\n` +
                            `${Mod.getRequiredForExtracts(obj)}` +
                            `${Mod.getRequiredInQuests(obj)}${Mod.getBehindTheLock(obj)}`;
                        db.locales.global[lang][`${keyId} Description`] =
                            keyInfo + '\n' + description;
                    }
                }
                keysWithInfo.push(keyId);
            }
            logger.info(`[${package_json_1.default.name}] Loaded: ${db.locales.global.en[`${mapId} Name`]}`);
        });
        const keysWithoutInfo = Object.entries(db.templates.items).filter((item) => {
            const id = item[0];
            return (ItemHelper.isOfBaseclasses(id, [
                BaseClasses_1.BaseClasses.KEY,
                BaseClasses_1.BaseClasses.KEY_MECHANICAL,
                BaseClasses_1.BaseClasses.KEYCARD,
            ]) && !keysWithInfo.includes(id));
        });
        keysWithoutInfo.forEach((key) => {
            const keyId = key[0];
            for (const stringId in db.locales.global) {
                if (config.backgroundColor) {
                    db.templates.items[keyId]._props.BackgroundColor = 'black';
                }
                if (config.descriptionInfo) {
                    const description = db.locales.global[stringId][`${keyId} Description`];
                    db.locales.global[stringId][`${keyId} Description`] =
                        `Junk: this key/ keycard is not used anywhere.` +
                            '\n\n' +
                            description;
                }
            }
        });
        logger.logWithColor(`[${package_json_1.default.name}-${package_json_1.default.version}] Added info and background colors to all keys/ keycards`, LogTextColor_1.LogTextColor.GREEN);
    }
    static getRequiredForExtracts(obj) {
        const { config, keyId, keyInfoFile, modLocale } = obj;
        if (config.requiredForExtracts) {
            let extractList = '';
            for (const extract of keyInfoFile.Keys[keyId].Extract) {
                extractList = extractList + extract + ', ';
            }
            const requiredForExtracts = extractList.length > 0
                ? extractList.substring(0, extractList.length - 2)
                : `${modLocale.no}`;
            return `${modLocale.requriedForExtracts}: ${requiredForExtracts}.\n`;
        }
        else {
            return '';
        }
    }
    static getRequiredInQuests(obj) {
        const { config, keyId, keyInfoFile, dbLangLocale, modLocale } = obj;
        if (config.requiredInQuests) {
            let questList = '';
            for (const questId of keyInfoFile.Keys[keyId].Quest) {
                questList = questList + dbLangLocale[`${questId} name`] + ', ';
            }
            const requiredInQuests = questList.length > 0
                ? questList.substring(0, questList.length - 2)
                : `${modLocale.no}`;
            return `${modLocale.requiredInQuests}: ${requiredInQuests}.\n`;
        }
        else {
            return '';
        }
    }
    static getBehindTheLock(obj) {
        const { config, keyId, keyInfoFile, modLocale } = obj;
        if (config.behindTheLoock) {
            let lootList = '';
            for (const lootId of keyInfoFile.Keys[keyId].Loot) {
                lootList = lootList + modLocale[lootId] + ', ';
            }
            const behindTheLock = lootList.length > 0
                ? lootList.substring(0, lootList.length - 2)
                : `${modLocale.no}`;
            return `${modLocale.behindTheLock}: ${behindTheLock}.\n`;
        }
        else {
            return '';
        }
    }
}
module.exports = { mod: new Mod() };
//# sourceMappingURL=mod.js.map
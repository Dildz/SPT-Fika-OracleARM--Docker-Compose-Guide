import { DependencyContainer } from 'tsyringe';

import { ItemHelper } from '@spt/helpers/ItemHelper';
import { BaseClasses } from '@spt/models/enums/BaseClasses';
import { LogTextColor } from '@spt/models/spt/logging/LogTextColor';
import { IDatabaseTables } from '@spt/models/spt/server/IDatabaseTables';
import { DatabaseServer } from '@spt/servers/DatabaseServer';
import { VFS } from '@spt/utils/VFS';

import { IPostDBLoadModAsync } from '@spt/models/external/IPostDBLoadModAsync';
import { ILogger } from '@spt/models/spt/utils/ILogger';
import _package from '../package.json';

class Mod implements IPostDBLoadModAsync {
  private modPath = 'user/mods/maxloo2-betterkeys-updated';
  private container: DependencyContainer;

  public async postDBLoadAsync(container: DependencyContainer): Promise<void> {
    this.container = container;
    const vfs: VFS = container.resolve<VFS>('VFS');

    const db: IDatabaseTables = container
      .resolve<DatabaseServer>('DatabaseServer')
      .getTables();

    const config: Record<string, any> = JSON.parse(
      vfs.readFile(`${this.modPath}/config/config.json`)
    );

    const github: string = config.github;

    if (config.enableAutoUpdate) {
      await this.autoUpdate(github, vfs);
      this.main(db, config);
    } else {
      this.main(db, config);
    }
  }

  private async autoUpdate(github: string, vfs: VFS) {
    const logger = this.container.resolve<ILogger>('WinstonLogger');

    const updatePromises = ['db', 'locales'].map((folderName) => {
      const folderPath = `${this.modPath}/${folderName}`;

      logger.info(`[${_package.name}] Checking for updates: ${folderPath}`);

      return Promise.all(
        vfs.getFiles(folderPath).map((fileName) => {
          const localFile = JSON.parse(
            vfs.readFile(`${folderPath}/${fileName}`)
          );
          const _version = localFile._version;

          return fetch(`${github}/server/${folderName}/${fileName}`)
            .then((response) => response.json())
            .then((targetFile) => {
              const targetVersion = targetFile._version;

              if (targetVersion !== _version) {
                logger.warning(
                  `[${_package.name}] Updating ${folderName}/${fileName} (Local: ${_version}, GitHub: ${targetVersion})`
                );
                vfs.writeFile(
                  `${folderPath}/${fileName}`,
                  JSON.stringify(targetFile, null, 2)
                );
              }
            });
        })
      );
    });

    return await Promise.all(updatePromises)
      .then(() => {
        logger.success(`[${_package.name}] Finished checking for updates.`);
      })
      .catch((error) => {
        logger.error(`[${_package.name}] Error checking for updates: ${error}`);
      });
  }

  public main(db: IDatabaseTables, config: Record<string, any>): void {
    const vfs = this.container.resolve<VFS>('VFS');
    const logger = this.container.resolve<ILogger>('WinstonLogger');
    const ItemHelper = this.container.resolve<ItemHelper>('ItemHelper');

    const _constants = JSON.parse(
      vfs.readFile(`${this.modPath}/db/_constants.json`)
    );

    const keysWithInfo: string[] = [];

    const mapIds: Record<string, any> = _constants.maps;
    mapIds.forEach(({ name: mapName, id: mapId }) => {
      const keyInfoFile: Record<string, any> = JSON.parse(
        vfs.readFile(`${this.modPath}/db/${mapName}.json`)
      );

      for (const keyId in keyInfoFile.Keys) {
        const keyItem = db.templates.items[keyId];

        if (config.backgroundColor) {
          if (
            config.yellowMarkedKeys &&
            _constants.markedKeys.includes(keyId)
          ) {
            keyItem._props.BackgroundColor = 'yellow';
          } else {
            const color =
              config.backgroundColors[db.locales.global['en'][`${mapId} Name`]];

            keyItem._props.BackgroundColor = color;
          }
        }

        if (config.descriptionInfo) {
          for (const lang in db.locales.global) {
            const description = db.locales.global[lang][`${keyId} Description`];

            let modLocale: Record<string, any>;

            if (!vfs.exists(`${this.modPath}/locales/${lang}.json`)) {
              modLocale = JSON.parse(
                vfs.readFile(`${this.modPath}/locales/en.json`)
              );
            } else {
              modLocale = JSON.parse(
                vfs.readFile(`${this.modPath}/locales/${lang}.json`)
              );
            }

            const dbLangLocale: Record<string, string> =
              db.locales.global[lang];

            const obj = {
              config,
              keyId,
              keyInfoFile,
              modLocale,
              dbLangLocale,
            };

            const keyInfo =
              `${modLocale.map}: ${dbLangLocale[`${mapId} Name`]}.\n` +
              `${Mod.getRequiredForExtracts(obj)}` +
              `${Mod.getRequiredInQuests(obj)}${Mod.getBehindTheLock(obj)}`;

            db.locales.global[lang][`${keyId} Description`] =
              keyInfo + '\n' + description;
          }
        }

        keysWithInfo.push(keyId);
      }

      logger.info(
        `[${_package.name}] Loaded: ${db.locales.global.en[`${mapId} Name`]}`
      );
    });

    const keysWithoutInfo = Object.entries(db.templates.items).filter(
      (item) => {
        const id = item[0];

        return (
          ItemHelper.isOfBaseclasses(id, [
            BaseClasses.KEY,
            BaseClasses.KEY_MECHANICAL,
            BaseClasses.KEYCARD,
          ]) && !keysWithInfo.includes(id)
        );
      }
    );

    keysWithoutInfo.forEach((key) => {
      const keyId = key[0];

      for (const stringId in db.locales.global) {
        if (config.backgroundColor) {
          db.templates.items[keyId]._props.BackgroundColor = 'black';
        }

        if (config.descriptionInfo) {
          const description =
            db.locales.global[stringId][`${keyId} Description`];

          db.locales.global[stringId][`${keyId} Description`] =
            `Junk: this key/ keycard is not used anywhere.` +
            '\n\n' +
            description;
        }
      }
    });

    logger.logWithColor(
      `[${_package.name}-${_package.version}] Added info and background colors to all keys/ keycards`,
      LogTextColor.GREEN
    );
  }

  static getRequiredForExtracts(obj: {
    config: Record<string, any>;
    keyId: string;
    keyInfoFile: Record<string, any>;
    modLocale: Record<string, any>;
    dbLangLocale: Record<string, string>;
  }): string {
    const { config, keyId, keyInfoFile, modLocale } = obj;

    if (config.requiredForExtracts) {
      let extractList = '';

      for (const extract of keyInfoFile.Keys[keyId].Extract) {
        extractList = extractList + extract + ', ';
      }

      const requiredForExtracts: string =
        extractList.length > 0
          ? extractList.substring(0, extractList.length - 2)
          : `${modLocale.none}`;

      return `${modLocale.requriedForExtracts}: ${requiredForExtracts}.\n`;
    } else {
      return '';
    }
  }

  static getRequiredInQuests(obj: {
    config: Record<string, any>;
    keyId: string;
    keyInfoFile: Record<string, any>;
    modLocale: Record<string, any>;
    dbLangLocale: Record<string, string>;
  }): string {
    const { config, keyId, keyInfoFile, dbLangLocale, modLocale } = obj;

    if (config.requiredInQuests) {
      let questList = '';

      for (const questId of keyInfoFile.Keys[keyId].Quest) {
        questList = questList + dbLangLocale[`${questId} name`] + ', ';
      }

      const requiredInQuests =
        questList.length > 0
          ? questList.substring(0, questList.length - 2)
          : `${modLocale.none}`;

      return `${modLocale.requiredInQuests}: ${requiredInQuests}.\n`;
    } else {
      return '';
    }
  }

  static getBehindTheLock(obj: {
    config: Record<string, any>;
    keyId: string;
    keyInfoFile: Record<string, any>;
    modLocale: Record<string, any>;
    dbLangLocale: Record<string, string>;
  }): string {
    const { config, keyId, keyInfoFile, modLocale } = obj;
    if (config.behindTheLoock) {
      let lootList = '';

      for (const lootId of keyInfoFile.Keys[keyId].Loot) {
        lootList = lootList + modLocale[lootId] + ', ';
      }

      const behindTheLock: string =
        lootList.length > 0
          ? lootList.substring(0, lootList.length - 2)
          : `${modLocale.none}`;

      return `${modLocale.behindTheLock}: ${behindTheLock}.\n`;
    } else {
      return '';
    }
  }
}

module.exports = { mod: new Mod() };

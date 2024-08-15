// noinspection SpellCheckingInspection

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { PreSptModLoader } from "@spt/loaders/PreSptModLoader";
import { DependencyContainer } from "tsyringe";
import { VFS } from "@spt/utils/VFS";
import { jsonc } from "jsonc";
import path from 'path';


class AmmoStats implements IPostDBLoadMod
{

	private config;

	private CalculateArmorLevel(penetrationValue, realismMode)
	{

		if (realismMode)
		{
			return (penetrationValue >= 100) ? 10
				: (penetrationValue >= 90) ? 9
					: (penetrationValue >= 80) ? 8
						: (penetrationValue >= 70) ? 7
							: (penetrationValue >= 60) ? 6
								: (penetrationValue >= 50) ? 5
									: (penetrationValue >= 40) ? 4
										: (penetrationValue >= 30) ? 3
											: (penetrationValue >= 20) ? 2
												: (penetrationValue >= 10) ? 1
													: 0;
		}

		// Values are taken from NoFoodAfterMidnight's EFT Ammo/Armor charts
		return (penetrationValue > 46) ? 6
			: (penetrationValue > 40) ? 5
				: (penetrationValue > 31) ? 4
					: (penetrationValue > 25) ? 3
						: (penetrationValue > 15) ? 2
							: (penetrationValue > 6) ? 1
								: 0;
	}

	private static IsPluginLoaded(): boolean
	{
		const fs = require('fs');
		const pluginName = "rairai.colorconverterapi.dll";

		// Fails if there's no ./BepInEx/plugins/ folder
		try
		{
			const pluginList = fs.readdirSync("./BepInEx/plugins").map(plugin => plugin.toLowerCase());
			return pluginList.includes(pluginName);
		}
		catch {
			return false;
		}
	}

	public postDBLoad(container: DependencyContainer): void
	{
		const logger = container.resolve<ILogger>("WinstonLogger");
		const itemTables = container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.items;
		const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
		const locales = Object.values(container.resolve<DatabaseServer>("DatabaseServer").getTables().locales.global);
		const localeKeys = Object.keys(container.resolve<DatabaseServer>("DatabaseServer").getTables().locales.global);
		const preSptModLoader = container.resolve<PreSptModLoader>("PreSptModLoader");
		const vfs = container.resolve<VFS>("VFS");
		this.config = jsonc.parse(vfs.readFile(path.resolve(__dirname, "../config/config.jsonc")));

		let realismMode = false;
		const modList = preSptModLoader.getImportedModDetails();

		for (const mod in modList)
		{
			if (modList[mod].name == "SPT Realism Mod" && !this.config.disableRealismSupport)
			{
				realismMode = true;
			}
		}

		//Checking for config proper config option, killing the mod if it's improper.
		if (this.config.MODE.toLowerCase() !== "prepend" && this.config.MODE.toLowerCase() !== "append")
		{
			return logger.error(`[AmmoStats] Error in src/this.config.json, MODE must be append or prepend.`);
		}
		if (this.config.SEPARATOR.toLowerCase() !== "oneline" && this.config.SEPARATOR.toLowerCase() !== "newline")
		{
			return logger.error(`[AmmoStats] Error in src/config.json, SEPARATOR must be oneline or newline.`);
		}


		let ammoStatDict = {};																		//Building our key,value dict
		let colorProfile = {};

		for (const itemID in itemTables)
		{	                                                        // Iterate through all itemIDs
			if (itemTables[itemID]._props.ammoType === "bullet" || itemTables[itemID]._props.ammoType === "buckshot")
			{
				let bulletDamage: number = itemTables[itemID]._props.Damage;	                        // Store its damage...
				let bulletPenetration: number = itemTables[itemID]._props.PenetrationPower;	        // Store its penetration...
				let bulletArmorTier: number = this.CalculateArmorLevel(bulletPenetration, realismMode);	    // Calculate what the best tier is for that penetration value
				let bulletType: String = "bullet";
				let bulletProjectiles: number = 1;

				if (itemTables[itemID]._props.ammoType === "buckshot")
				{	                        // Override bulletType and bulletProjectiles if it's a buckshot type ammo
					bulletType = "buckshot";
					bulletProjectiles = itemTables[itemID]._props.buckshotBullets;
				}
				ammoStatDict[itemID] = [bulletDamage, bulletPenetration, bulletArmorTier, bulletType, bulletProjectiles];	// Write the values into our dict

				// Fetch the proper color profile for background colors
				// For custom hex value colors...
				if (AmmoStats.IsPluginLoaded() && this.config.enableCustomBackgroundColors == true)
				{
					if (realismMode)
					{
						colorProfile = this.config.ColorProfilesRealism[this.config.ColorProfileRealism];
					}
					else
					{
						colorProfile = this.config.ColorProfiles[this.config.ColorProfile];
					}

					itemTables[itemID]._props.BackgroundColor = colorProfile[bulletArmorTier.toString()];
				}
				// For those without the plugin/without the functionality enabled...
				else if (this.config.enableCustomBackgroundColors == true)
				{
					if (realismMode)
					{
						colorProfile = this.config.realismBackgroundColors;
					}
					else
					{
						colorProfile = this.config.backgroundColors;
					}

					itemTables[itemID]._props.BackgroundColor = colorProfile[bulletArmorTier.toString()];
				}
			}
		}


		for (const localeID in locales)
		{	                                                    // Iterate through all language options
			let langText = localeKeys[localeID];													// Getting the text "en", "ru", etc

			let locDamage = this.config.Locales.en.Damage;
			let locPenetration = this.config.Locales.en.Penetration;
			let locBestArmorLv = this.config.Locales.en.TextEffectArmorLv;
			let locEffectNone = this.config.Locales.en.EffectNone;
			let locPellets = this.config.Locales.en.Pellets;
			let separatorChar = "";

			if (this.config.SEPARATOR.toLowerCase() == "newline")
			{
				separatorChar = "\n";
			}
			else if (this.config.SEPARATOR.toLowerCase() == "oneline")
			{
				separatorChar = " | ";
			}

			if (this.config.Locales[langText] && Object.keys(this.config.Locales[langText]).length == Object.keys(this.config.Locales.en).length)
			{
				locDamage = this.config.Locales[langText].Damage;
				locPenetration = this.config.Locales[langText].Penetration;
				locBestArmorLv = this.config.Locales[langText].TextEffectArmorLv;
				locEffectNone = this.config.Locales[langText].EffectNone;
				locPellets = this.config.Locales[langText].Pellets;
			}

			if (this.config.Locales[langText] && Object.keys(this.config.Locales[langText]).length != Object.keys(this.config.Locales.en).length)
			{
				if (this.config.debugLogging)
				{
					logger.warning(`[AmmoStats]: WARNING! Locale for language key "${langText}" is not complete and will not be properly applied.`);
					logger.warning(`[AmmoStats]: Please ask the author to update the localization for this language, or manually update the config file and add all missing entries for the language.`);
				}
			}

			for (const key in ammoStatDict)
			{
				let stringToAdd = "";
				let desc = "";

				try
				{
					desc = databaseServer.getTables().locales.global[langText][`${key} Description`]; 	                    // Copy the description
					if (this.config.debugLogging) logger.success(`[AmmoStats]: Editing description for ${JSON.stringify(key)} in lang ${langText}`);
				}
				catch (exception)
				{
					if (this.config.debugLogging) logger.warning(`[AmmoStats]: WARNING! Error with item "${JSON.stringify(key)}" in lang ${langText}, skipping entry!`);
					continue;
				}

				if (ammoStatDict[key][3] === "bullet" && this.config.addDamage === true)
				{
					stringToAdd = locDamage + ": " + ammoStatDict[key][0]
						+ separatorChar;
				}
				else if (ammoStatDict[key][3] === "buckshot" && this.config.addDamage === true)
				{	// Damage string
					stringToAdd = locDamage + ": " + ammoStatDict[key][0]
						+ " * " + ammoStatDict[key][4] + " " + locPellets		                    // Adding pellet count
						+ " (" + ammoStatDict[key][0] * ammoStatDict[key][4] + ")"		            // Calculating total possible damage in parenthesis
						+ separatorChar;
				}

				if (this.config.addPen === true)
				{													// Penetration string
					stringToAdd += locPenetration + ": " + ammoStatDict[key][1]
						+ separatorChar;
				}

				if (this.config.addEffectArmorLv === true)
				{											// Armor level string
					if (ammoStatDict[key][2] !== 0)
					{
						stringToAdd += locBestArmorLv + ": " + ammoStatDict[key][2]
							+ separatorChar;
					}
					else
					{
						stringToAdd += locBestArmorLv + ": " + locEffectNone
							+ separatorChar;
					}
				}

				stringToAdd = stringToAdd.slice(0, stringToAdd.length - separatorChar.length);		// Trim the last separator off, used to get around issues where a user disables certain stats in config

				if (this.config.MODE.toLowerCase() === "prepend" && (this.config.addDamage || this.config.addPen || this.config.addEffectArmorLv))
				{	                                	// Checking which mode was selected in the config
					databaseServer.getTables().locales.global[langText][`${key} Description`] = stringToAdd + "\n\n" + desc;	// Putting our new string with weapon info in front, newlines, then the original description
				}
				else if (this.config.MODE.toLowerCase() === "prepend" && (this.config.addDamage || this.config.addPen || this.config.addEffectArmorLv))
				{																				// Append mode
					databaseServer.getTables().locales.global[langText][`${key} Description`] = desc + "\n\n" + stringToAdd;	// Putting the description first, newlines, then our string appended to the end
				}

				if (this.config.showPenInName === true)
				{												// Add pen tier to the name
					let namePen = "  -  (" + ammoStatDict[key][2] + ")";
					databaseServer.getTables().locales.global[langText][`${key} Name`] += namePen;
				}
			}
		}

		if (this.config.addDamage || this.config.addPen || this.config.addEffectArmorLv)
		{
			logger.success(`[AmmoStats]: Loaded successfully. Running in ${this.config.MODE.toLowerCase()} mode.`);
		}
		else 
		{
			logger.success(`[AmmoStats]: Loaded successfully.`);
		}

		if (AmmoStats.IsPluginLoaded())
		{
			logger.success(`[AmmoStats]: ColorConverter Plugin loaded! Extended functionality enabled.`);
		}
		if (realismMode)
		{
			logger.success(`[AmmoStats]: Realism compatibility enabled.`);
		}

	}
}

module.exports = { mod: new AmmoStats() };
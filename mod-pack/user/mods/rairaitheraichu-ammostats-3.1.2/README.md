# AmmoStats v3.1.2
Author: RaiRaiTheRaichu
Additional credits:
- user/9002-lua on sp-tarkov.com, for some refactoring for languages and adding support for Korean localization!
- user/18247-melody/ on sp-tarkov.com, for Russian language support!
- user/13111-egnbv/ on sp-tarkov.com, for Chinese language support!
- user/18495-masterauger/ on sp-tarkov.com, for French language support!
- user/24187-jackrippergame/ on sp-tarkov.com, for Japanese language support!
- user/25383-lastocka/ on sp-tarkov.com, for Czech language support!
- user/19569-javitecge/ on sp-tarkov.com, for Spanish/Mexican language support!
- user/24350-maege/ on sp-tarkov.com, for German language support!
- user/30356-randomcitizen/ on sp-tarkov.com, for Polish language support!
- user/53869-lisamika/ on sp-tarkov.com, for Traditional Chinese language support!
- user/33597-octopussy/ on hub.sp-tarkov.com, for Italian language support!
- user/27639-manodavis/ on hub.sp-tarkov.com, for Brazilian Portugese language support!

### ---BUILT FOR SPT VERSION 3.9.0---

### NEW, PLEASE READ: Officially deprecated by BSG!
Ammo stats are being shown in the effect info for each bullet now by default (same as where Bleed chance etc has been shown). That officially means that this mod is no longer required in any form.

By default, this mod will no longer put the damage, penetration, and armor tier in the description of the bullet. You can turn that back on in the config.jsonc if you'd like, but it's unnecessary.

The mod still, however, will use color schemes for armor penetration tiers and change the background colors. These tiers may not be 1:1 with BSG's code that displays it in the description (they should roughly show whatever the highest tier is "Medium" effectiveness). In the future I may rework the formula to match whatever BSG is using identically. For now, just treat the background colors as you always have - a general expectation of performance.

### NEW: Enhanced color configuration when the Color Converter plugin is also enabled!
To use hexcodes and change color profiles (for colorblindness and personal preference), check out the new config options!

### NEW: Full SPT Realism mod support!
Notice: If you're not using Realism's Ballistic changes, disable the Realism support in the config.jsonc file to have the correct armor penetration tier stats and colors.
    - UPDATE: Realism has changed how it modifies items in the database. That means you may need to move this mod further down the load order (use a load order program here on the mod workshop, or edit your load order's json file by hand). See the comments on this mod page for more information regarding Realism compatibility. Sorry! It's not something I can do anything in this mod to fix.


Deprecated description:
This mod adds the stats of different types of ammo, including modded ammo, in their descriptions. See configuration in src/config.jsonc for configuration.

Currently, you are able to change the mode between "prepend" and "append" modes. 
Prepend mode will print the damage, penetration, and effective armor levels before the ammo description (it comes first.)
Append mode will add them to the end of the description. You may have to scroll down a bit depending on the length of the game's description.

You can also change the separator from "newline" to "oneline", which changes the values from being split on new lines to all being fit on one line, separated by pipes ( | ).

Three values are added, Damage (the raw damage), penetration (raw penetration value), and highest armor tier it is effective against (directly calculated from the penetration value).
Shotgun buckshot is shown per pellet, with how many pellets are fired, and total possible damage in parenthesis afterwards.
Effective armor levels are calculated similarly to NoFoodAfterMidnight's Ammo and Armor sheet, the highest tier it is moderately effective against is shown.

All languages should be supported, but the text will still be in english unless it is localized - easily done by copying the entire block for "en" and changing the key from en to your locale name.
See the entry for "kr"/"ru" for a clear example.

If you create a language addition, please PM me on Discord (@RaiRaiTheRaichu#) or on hub.sp-tarkov.com (much slower response time) with the information and the mod will be updated and you can be credited.


## ---INSTALL INFO---

How to install:
Drag and drop the included `user` folder from this zip into your SPT folder, allow it to merge with your existing folder.

If you're updating from an older version, please be sure to delete the old mod from your folder. You may want to back up your color profile settings if you've customized them as well.

If you want to enable more color options, please install the Bepinex Color Converter API plugin as well to your BepInEx/plugins/ folder!
If you're running the server from a separate folder, please make sure the plugin is also located within a BepInEx/plugins/ folder in the same directory - this mod checks for the plugin by the presence of the .dll in order to enable the extended functionality.


## ---CHANGELOGS---

#### v1.0.0 Changelog: 
- Ammo values (damage, penetration) that has been changed via a mod will be shown with their modded values properly, and ammo that was created by a mod is also now supported.
- Formula for determining the most effective armor tier was slightly adjusted. In general, it is the highest possible armor level that the penetration value scores at least a 5 on the ammo chart.

#### v2.0.0 Changelog: 
- There is now the ability to change from all stats on separate lines to all on one line.
- Localization for KN (Korean) language as well as a framework for adding your own language in the config (Thanks Lua!)
- Massive rewrite with help from Lua, the mod will have far more stats to optionally display in the future.
- Easy to enable and disable stats from being shown by changing from "true" to "false" next to the stats in the config. Currently there are only three values to show.
- Error handling for modded items with improper locale entries (missing Description entries).

#### v2.0.1 Changelog:
- Minor change to the version in the package.json, compatible with version 2.2.2 of SPT.

#### v2.0.2 Changelog:
- Localization for RU (Russian) language - thanks Melody!
- Minor change to the version in the package.json, compatible with version 2.2.3 of SPT.

#### v2.0.3 Changelog:
- Localization for CN (Chinese) language - thanks EGNBV!
- Minor change to the version in the package.json, compatible with version 2.3.1 of SPT.

#### v2.1.0 Changelog:
- Major refactor to support SPT version 3.0.0!
- Added French language support - thanks MasterAuger!

#### v2.1.1 Changelog:
- Minor refactor to support SPT version 3.1.0.

#### v2.1.2 Changelog:
- Fixed bug that showed localized languages in English even though they are supported.
- Minor refactor to support SPT version 3.1.1.

#### v2.1.3 Changelog:
- Added Japanese language support - thanks jackrippergame!

#### v2.1.4 Changelog:
- Minor change to the version in the package.json, compatible with version 3.2.2 of SPT.
- Added option to suppress the debug logging to get rid of some warning text when modded ammo types don't have descriptions added for all languages.

#### v2.1.5 Changelog:
- Added Czech language support - thanks lastocka!
- Minor change to the version in the package.json, compatible with version 3.2.4 of SPT.

#### v2.1.6 Changelog:
- Added Spanish/Mexican language support - thanks javitecge!
- Minor change to the version in the package.json, compatible with version 3.3.0 of SPT.

#### v2.2.0 Changelog:
- Added German language support - thanks MAEGE!
- Major refactor to localization to comply with new standards as of client version 20765.
- Minor change to the version in the package.json, compatible with version 3.4.0 of SPT.

#### v2.2.1 Changelog:
- Minor change to the version in the package.json, compatible with version 3.5.0 of SPT.

#### v3.0.0 Changelog:
- Added support for the new Color Converter API client plugin.
- Added support for the SPT Realism mod.
- Added Polish language support - thanks RandomCitizen!
- Changed config to .jsonc, added proper comments to the options.
- Color profiles! Check the config.jsonc to view the new color profiles (including colorblind/grayscale mode).
- Minor change to the version in the package.json, compatible with version 3.7.0+ of SPT.
    - This version will NOT work for versions prior to 3.7.0 due to the change to .jsonc - please use the older release if you're playing on 3.6.1 or earlier!

#### v3.1.0 Changelog:
- Fixed an issue where background colors were being applied to ammunition when it was disabled in the config
- Revised SPT Realism mod compatibility, no additional config required, it's automatically detected
- Minor change to the version in the package.json, compatible with version 3.8.0+ of SPT.

#### v3.1.1 Changelog:
- Fixed an issue where background colors were being applied to ammunition when it was disabled in the config, for real this time.
- Added a config option to disable Realism compatibility, so people can use Realism with their Ballistics changes off and have the proper armor tier pen stats and colors.
- Added Traditional Chinese language support - thanks LisaMikA!
- Refactor of zip file structure - now installed by dragging and dropping the included "user/mods/" folder into the root of your SPT directory.

#### v3.1.2 Changelog:
- Added Italian language support - thanks Octopussy!
- Added Brazilian Portugese language support - thanks manodavis!
- Stats are no longer shown in the description by default, thanks to BSG.
- Refactor to module changes for SPT 3.9.0+.
- Minor change to the version in the package.json, compatible with version 3.9.0+ of SPT.

## ---CONTACT---

@RaiRaiTheRaichu - Discord
user/6798-rairaitheraichu - on sp-tarkov.com 

## ---LICENSE---

Copyright 2022-2024 - RaiRaiTheRaichu

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
SouthernHemisphereSeasons Mod

Version: 1.2.0  
Author: Dildz  
SPT-AKI Version: ^3.9.x


## Overview:

- The SouthernHemisphereSeasons mod aligns the in-game seasons with the real-life seasons for players in the Southern Hemisphere.
- The mod automatically adjusts the in-game season based on the current date, ensuring that the season reflects the real-world time of year. 


### Key Features:

- Real-Life Season Alignment: Automatically sets the in-game season based on the real-life date, corresponding to the Southern Hemisphere's seasonal calendar.
- Seasonal Weather Conditions: Weather conditions are tailored to each season, with options to reduce fog, rain, and adjust cloud coverage.
- Persistence Across Reboots: The season is recalculated on each server startup, ensuring continuity regardless of server reboots.


## Installation:

1. Download and Extract: Download the mod package and extract it into your SPT-AKI mod directory (`user/mods/`).

2. Configuration: 
   - The mod comes with a `config.json` file where you can enable or disable various features like fog reduction, rain reduction, and clear skies.
   - The `weatherconfigadvanced.json` file allows for detailed customization of weather parameters for each season.


## Configuration Options:

The mod includes several configuration options that can be adjusted in `config/config.json`:

- enable: Toggle the mod on or off.
- consoleMessages: Enable or disable console messages for debugging.
- lessFog: Reduce fog intensity across all seasons.
- lessRain: Reduce the frequency and intensity of rain.
- clearSkies: Increase the likelihood of clear skies.


## How It Works:

1. Season Determination: The mod calculates the current season based on the server’s system date and time. It follows the Southern Hemisphere's seasonal calendar:
   - Summer: December 21 to March 20
   - Autumn: March 20 to June 21
   - Winter: June 21 to September 23
   - Spring: September 23 to December 21

2. Weather Application: Based on the determined season, the mod applies the appropriate weather configuration as defined in `weatherconfigadvanced.json`.

3. Persistence: The mod recalculates the season on each server start, ensuring that the correct season is always in effect.


## Known Issues:

- The mod defaults to summer if there is any issue determining the current season.
- Ensure the server’s time zone is correctly configured, as the mod relies on the system date to determine the season.


## Support:

This mod is provided as-is, with no official support.
It is intended for tinkerers and advanced users who understand how to modify and troubleshoot their game environment.
Please make sure to back up your game and mod files before making any changes.


## License:

This mod is licensed under the MIT License. See the `LICENSE` file for more details.

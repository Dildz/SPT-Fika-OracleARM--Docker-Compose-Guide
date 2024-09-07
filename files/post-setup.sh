# post-setup.sh

## This script does the following:
## 1. Sets read/write permissions for the ubuntu user on necessary directories.
## 2. Creates the BepInEx folder and sets permissions.
## 3. Asks the user if they want to copy the mod-pack and HD Trader Images.
## 4. Copies the mod-pack and HD Trader Images if the user chooses to do so.
## 5. Sets up cron tasks to restart the FIKA server and change launcher background images.
## It must be run as sudo.

#!/bin/bash

echo "Running post-setup.sh ..."

# Ensure the script is run with sudo
if [ "$(id -u)" -ne 0 ]; then
  echo "This script must be run with sudo."
  exit 1
fi

# Define paths to directories that need permission changes
SERVER_DIR="/home/ubuntu/docker/containers/spt-fika/server"
BEPINEX_DIR="$SERVER_DIR/BepInEx"
MODS_DIR="$SERVER_DIR/user/mods"
PROFILES_DIR="$SERVER_DIR/user/profiles"
TRADER_IMAGES_DIR="$SERVER_DIR/SPT_Data/Server/images/traders/"

# Set read/write permissions for the ubuntu user
echo "Setting read/write permissions for ubuntu user on necessary directories..."
chown -R ubuntu:ubuntu "$SERVER_DIR" "$MODS_DIR" "$PROFILES_DIR" "$TRADER_IMAGES_DIR"
chmod -R 775 "$SERVER_DIR" "$MODS_DIR" "$PROFILES_DIR" "$TRADER_IMAGES_DIR"

echo "Permissions set successfully."

# Create BepInEx folder and set permissions
echo "Creating BepInEx folder and setting permissions..."
mkdir -p "$BEPINEX_DIR"
chown ubuntu:ubuntu "$BEPINEX_DIR"
chmod 775 "$BEPINEX_DIR"

# Ask the user if they want to copy the mod-pack
while true; do
    read -p "Do you want to copy the mod-pack and HD Trader Images? (y/n): " response
    case "$response" in
        [Yy]* )
            # If the user responds with 'y' or 'Y', proceed with copying mods
            echo "Copying mods and HD Trader Images..."
            # Define paths for mod copy
            MODS_SOURCE="/home/ubuntu/github-repos/SPT-Fika-modded--Docker-Guide/mod-pack/*"
            MODS_DEST="/home/ubuntu/docker/containers/spt-fika/server"
            TRADER_IMAGES_SOURCE="/home/ubuntu/github-repos/SPT-Fika-modded--Docker-Guide/files/HD-trader-images/*"
            TRADER_IMAGES_DEST="/home/ubuntu/docker/containers/spt-fika/server/SPT_Data/Server/images/traders/"

            echo "Copying mods from $MODS_SOURCE to $MODS_DEST"
            cp -rf $MODS_SOURCE $MODS_DEST

            echo "Copying HD Trader Images from $TRADER_IMAGES_SOURCE to $TRADER_IMAGES_DEST"
            cp -rf $TRADER_IMAGES_SOURCE $TRADER_IMAGES_DEST

            # Verify that the files have been copied successfully
            if [ $? -eq 0 ]; then
                echo "Mod-Pack and HD Trader Images copied successfully."
            else
                echo "Failed to copy files."
                exit 1
            fi
            break
            ;;
        [Nn]* )
            # If the user responds with 'n' or 'N', do not copy mods
            echo "Please install mods manually if needed."
            break
            ;;
        * )
            # If the input is not valid, prompt the user to try again
            echo "Invalid response. Please enter 'y' or 'n'."
            ;;
    esac
done

# Set up the cron tasks to restart the FIKA server & change launcher background images
echo "Setting up the cron tasks to restart the FIKA server and change launcher background images..."

# Define the path to the scripts
RESTART_SCRIPT="/home/ubuntu/docker/containers/spt-fika/files/restart-fika.sh"
BG_CHANGE_SCRIPT="/home/ubuntu/docker/containers/spt-fika/files/randomize-bg.sh"

# Define the cron tasks
cron_task="0 2 * * * $RESTART_SCRIPT"
cron_task_bg="0 0 * * * $BG_CHANGE_SCRIPT"

# Add the cron tasks to the crontab, checking for existing entries to prevent duplicates
(crontab -l 2>/dev/null | grep -v -F "$RESTART_SCRIPT" ; echo "$cron_task") | crontab -
(crontab -l 2>/dev/null | grep -v -F "$BG_CHANGE_SCRIPT" ; echo "$cron_task_bg") | crontab -

echo "Cron tasks have been set up:
- SPT-FIKA server will restart daily at 2:00 AM.
- Launcher background images will change daily at midnight."

# Remove pre-setup.sh from the home directory
rm /home/ubuntu/pre-setup.sh
echo "pre-setup.sh removed from the home directory."

echo "post-setup.sh completed."

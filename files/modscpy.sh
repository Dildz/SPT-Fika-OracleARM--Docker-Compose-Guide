# modscpy.sh

#!/bin/bash
echo "Running modscpy.sh ..."

# Ensure the script is run with sudo
if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as sudo. To run it, use: sudo ./modscpy.sh"
    exit 1
fi

# Define the source and destination directories for client/server mods & HD trader images
MODS_SOURCE="/home/ubuntu/github-repos/SPT-Fika-modded--Docker-Guide/mod-pack/*"

MODS_DEST="/home/ubuntu/docker/containers/spt-fika-modded/server"

TRADER_IMAGES_SOURCE="/home/ubuntu/github-repos/SPT-Fika-modded--Docker-Guide/files/HD-trader-images/*"
TRADER_IMAGES_DEST="/home/ubuntu/docker/containers/spt-fika-modded/server/SPT_Data/Server/images/traders/"

# Ensure destinations have the correct permissions for the sudo user
echo "Setting permissions for $SUDO_USER on required directories..."
sudo chown -R $SUDO_USER:$SUDO_USER /home/ubuntu/docker/containers/spt-fika-modded
sudo chmod -R 775 /home/ubuntu/docker/containers/spt-fika-modded

sudo chown -R $SUDO_USER:$SUDO_USER /home/ubuntu/docker/containers/spt-fika-modded/server
sudo chmod -R 775 /home/ubuntu/docker/containers/spt-fika-modded/server

sudo chown -R $SUDO_USER:$SUDO_USER /home/ubuntu/docker/containers/spt-fika-modded/server/user/mods
sudo chmod -R 775 /home/ubuntu/docker/containers/spt-fika-modded/server/user/mods

sudo chown -R $SUDO_USER:$SUDO_USER $TRADER_IMAGES_DEST
sudo chmod -R 775 $TRADER_IMAGES_DEST

# Copy the client & server mods
echo "Copying mods from $MODS_SOURCE to $MODS_DEST"
cp -rf $MODS_SOURCE $MODS_DEST

# Copy the HD trader images
echo "Copying HD Trader Images from $TRADER_IMAGES_SOURCE to $TRADER_IMAGES_DEST"
cp -rf $TRADER_IMAGES_SOURCE $TRADER_IMAGES_DEST

# Set permissions for the copied client files
sudo chown -R $SUDO_USER:$SUDO_USER /home/ubuntu/docker/containers/spt-fika-modded/server/BepInEx
sudo chmod -R 775 /home/ubuntu/docker/containers/spt-fika-modded/server/BepInEx

# Set permissions for the profiles directory
sudo chown -R $SUDO_USER:$SUDO_USER /home/ubuntu/docker/containers/spt-fika-modded/server/user/profiles
sudo chmod -R 775 /home/ubuntu/docker/containers/spt-fika-modded/server/user/profiles

# Verify that the files have been copied successfully
if [ $? -eq 0 ]; then
    echo "Mod-Pack and HD Trader Images copied successfully."
else
    echo "Failed to copy files."
    exit 1
fi

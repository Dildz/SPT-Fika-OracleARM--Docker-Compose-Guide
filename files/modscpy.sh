# modscpy.sh

#!/bin/bash
echo "Running modscpy.sh ..."

# Ensure the script is run with sudo
if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as sudo. To run it, use: sudo ./modscpy.sh"
    exit 1
fi

# Define the source and destination directories for client/server mods & HD trader images
MODS_SOURCE="$HOME/github-repos/SPT-Fika-modded--Docker-Guide/mod-pack/*"
MODS_DEST="$HOME/docker/containers/spt-fika-modded/server/"

TRADER_IMAGES_SOURCE="$HOME/github-repos/SPT-Fika-modded--Docker-Guide/files/HD trader images/*"
TRADER_IMAGES_DEST="$HOME/docker/containers/spt-fika-modded/server/SPT_Data/Server/images/traders/"

# Ensure destinations have the correct permissions for the sudo user
echo "Setting permissions for $SUDO_USER on required directories..."
chown -R $SUDO_USER:$SUDO_USER $HOME/docker/containers/spt-fika-modded/server/user/mods
chmod -R 775 $HOME/docker/containers/spt-fika-modded/server/user/mods

chown -R $SUDO_USER:$SUDO_USER $TRADER_IMAGES_DEST
chmod -R 775 $TRADER_IMAGES_DEST

# Copy the client & server mods
echo "Copying mods from $MODS_SOURCE to $MODS_DEST"
cp -rf $MODS_SOURCE $MODS_DEST

# Copy the HD trader images
echo "Copying HD Trader Images from $TRADER_IMAGES_SOURCE to $TRADER_IMAGES_DEST"
cp -rf $TRADER_IMAGES_SOURCE $TRADER_IMAGES_DEST

# Verify that the files have been copied successfully
if [ $? -eq 0 ]; then
    echo "Mod-Pack and HD Trader Images copied successfully."
else
    echo "Failed to copy files."
    exit 1
fi

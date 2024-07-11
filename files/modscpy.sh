# modscpy.sh

#!/bin/bash
echo "Copying mods to the server folder..."

# Ensure the script is run with sudo
if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as sudo. To run it, use: sudo ./modscpy.sh"
    exit 1
fi

# Define the source and destination directories
MODS_SOURCE="$HOME/github-repos/SPT-Fika-modded--Docker-Guide/mod-pack/*"
SERVER_DEST="$HOME/docker/containers/spt-fika-modded/server/"

# Copy the contents of the mods folder to the server directory
cp -rf $MODS_SOURCE $SERVER_DEST

# Ensure all mod files have the correct permissions for the user running the script
chown -R $SUDO_USER:$SUDO_USER $HOME/docker/containers/spt-fika-modded/server/user/mods
chmod -R 775 $HOME/docker/containers/spt-fika-modded/server/user/mods

# Verify that the files have been copied successfully
if [ $? -eq 0 ]; then
    echo "Mod-Pack copied successfully."
else
    echo "Failed to copy mod-pack."
    exit 1
fi

echo "Mod-Pack files have been copied and permissions set."

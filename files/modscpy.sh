#!/bin/bash
echo "Copying mods to the server folder..."

# Ensure the script is run with sudo
if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as root. Use sudo to run it."
    exit 1
fi

# Define the source and destination directories
MODS_SOURCE="/home/ubuntu/github-repos/SPT-Fika-modded--Docker-Guide/mods/*"
SERVER_DEST="/home/ubuntu/docker/containers/spt-fika-modded/server/"

# Ensure the destination directory exists
if [ ! -d "$SERVER_DEST" ]; then
    echo "Destination directory does not exist. Creating it..."
    mkdir -p "$SERVER_DEST"
fi

# Copy the contents of the mods folder to the server directory
cp -r $MODS_SOURCE $SERVER_DEST

# Ensure all files have the correct permissions for the ubuntu user
chown -R ubuntu:ubuntu $SERVER_DEST

# Verify that the files have been copied successfully
if [ $? -eq 0 ]; then
    echo "Mods copied successfully."
else
    echo "Failed to copy mods."
    exit 1
fi

echo "Mod files have been copied and permissions set."

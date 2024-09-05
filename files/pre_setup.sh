# pre_setup.sh

## This script is used to set up the directories and files needed for the FIKA server Docker container.
## It creates the necessary directories, clones the repository, and copies the files to the container's files directory.
## Once the files are copied, it builds the Docker image using the Dockerfile.
## Modify the container and github-repos directories as needed if you are not using the default paths.

#!/bin/bash

echo "Running pre_setup.sh ..."

# Set up directories (modify paths if you have an existing docker contianer folder)
echo "Creating container directories..."
mkdir -p /home/ubuntu/docker/containers/spt-fika-modded/files
mkdir -p /home/ubuntu/docker/containers/spt-fika-modded/logs
mkdir -p /home/ubuntu/docker/containers/spt-fika-modded/server

# Define the container's file path
export FIKA_FILES=/home/ubuntu/docker/containers/spt-fika-modded/files

# Create a github-repos directory if it doesn't exist
echo "Creating GitHub repository directory..."
mkdir -p /home/ubuntu/github-repos

# Clone the SPT-Fika-modded--Docker-Guide repository
echo "Cloning the SPT-Fika-modded--Docker-Guide repository..."
cd /home/ubuntu/github-repos
git clone https://github.com/Dildz/SPT-Fika-modded--Docker-Guide.git

# Copy the Dockerfile and scripts to the files directory
echo "Copying files to the fika directory..."
cp /home/ubuntu/github-repos/SPT-Fika-modded--Docker-Guide/files/Dockerfile $FIKA_FILES
cp /home/ubuntu/github-repos/SPT-Fika-modded--Docker-Guide/files/fcpy.sh $FIKA_FILES
cp /home/ubuntu/github-repos/SPT-Fika-modded--Docker-Guide/files/randomize_bg.sh $FIKA_FILES
cp /home/ubuntu/github-repos/SPT-Fika-modded--Docker-Guide/files/restart_fika.sh $FIKA_FILES

# Copy the SPT launcher background images folder to the fika directory
echo "Copying launcher images to the fika directory..."
cp -r "/home/ubuntu/github-repos/SPT-Fika-modded--Docker-Guide/files/SPT-launcher-images" $FIKA_FILES

# Navigate to the container's files directory
cd $FIKA_FILES

# Build the Docker image
echo "Building the Docker image..."
docker build --no-cache --label modded-fika -t modded-fika .

echo "Docker image build process should have completed successfully. If not, follow the instructions to troubleshoot."
echo "Follow the next steps to proceed with the setup."

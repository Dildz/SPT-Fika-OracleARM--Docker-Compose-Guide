# pre-setup.sh

## This script is does serveral things:
## 1. Creates the necessary directories for the SPT-FIKA server Docker container.
## 2. Clones the SPT-Fika--Docker-Guide repository to get the Dockerfile and scripts.
## 3. Copies the Dockerfile and scripts to the container's files directory.
## 4. Copies the SPT launcher background images folder to the container's files directory.
## 5. Builds the Docker image using the Dockerfile.
## 6. Runs the docker-compose up command to create the SPT-FIKA server files.

#!/bin/bash

echo "Running pre-setup.sh ..."

# Set up directories (modify paths if you have an existing docker container folder)
echo "Creating container directories..."
mkdir -p /home/ubuntu/docker/containers/spt-fika/files
mkdir -p /home/ubuntu/docker/containers/spt-fika/logs
mkdir -p /home/ubuntu/docker/containers/spt-fika/server

# Define the container's file path
export FIKA_FILES=/home/ubuntu/docker/containers/spt-fika/files

# Create a github-repos directory if it doesn't exist
echo "Creating GitHub repository directory..."
mkdir -p /home/ubuntu/github-repos

# Define the repository path
REPO_DIR="/home/ubuntu/github-repos/SPT-Fika-modded--Docker-Guide"

# Check if the repository already exists
if [ -d "$REPO_DIR" ]; then
    echo "Repository already exists. Continuing without cloning..."
else
    # Clone the SPT-Fika-modded--Docker-Guide repository
    echo "Cloning the SPT-Fika-modded--Docker-Guide repository..."
    cd /home/ubuntu/github-repos
    git clone https://github.com/Dildz/SPT-Fika-modded--Docker-Guide.git
fi

# Copy the Dockerfile and scripts to the files directory
echo "Copying files to the FIKA directory..."
cp /home/ubuntu/github-repos/SPT-Fika-modded--Docker-Guide/files/docker-compose.yml $FIKA_FILES
cp /home/ubuntu/github-repos/SPT-Fika-modded--Docker-Guide/files/Dockerfile $FIKA_FILES
cp /home/ubuntu/github-repos/SPT-Fika-modded--Docker-Guide/files/init-server.sh $FIKA_FILES
cp /home/ubuntu/github-repos/SPT-Fika-modded--Docker-Guide/files/randomize-bg.sh $FIKA_FILES
cp /home/ubuntu/github-repos/SPT-Fika-modded--Docker-Guide/files/restart-fika.sh $FIKA_FILES

# Copy the SPT launcher background images folder to the FIKA directory
echo "Copying launcher images to the FIKA directory..."
cp -r "/home/ubuntu/github-repos/SPT-Fika-modded--Docker-Guide/files/SPT-launcher-images" $FIKA_FILES

# Navigate to the container's files directory
cd $FIKA_FILES || {
    echo "Failed to navigate to the FIKA files directory. Exiting."
    exit 1
}

# Build the Docker image
echo "Building the container image ..."
docker-compose build --no-cache spt-fika
echo "Image built successfully."

# Run the docker-compose up command to create the SPT-FIKA server files
echo "Bringing up the container for the 1st time ..."
docker-compose up -d spt-fika 
echo "SPT-FIKA server has been started, tailing logs & exiting."
echo "When the server is ready, you can exit the logs by pressing Ctrl+C and follow the next step to run post-setup.sh."

# Wait 5sec before tailing the logs
sleep 5

docker-compose logs -f spt-fika

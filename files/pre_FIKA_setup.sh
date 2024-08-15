# pre_FIKA_setup.sh

#!/bin/bash
echo "Running pre_FIKA_setup.sh ..."

# Set up directories (modify paths if you have an existing docker contianer folder)
echo "Creating docker directories..."
mkdir -p $HOME/docker/containers/spt-fika-modded/fika
mkdir -p $HOME/docker/containers/spt-fika-modded/server

# Create a github-repos directory if it doesn't exist
echo "Creating GitHub repository directory..."
mkdir -p $HOME/github-repos

# Clone the SPT-Fika-modded--Docker-Guide repository
echo "Cloning the SPT-Fika-modded--Docker-Guide repository..."
cd $HOME/github-repos
git clone https://github.com/Dildz/SPT-Fika-modded--Docker-Guide.git

# Copy the Dockerfile and scripts to the fika directory
echo "Copying files to the fika directory..."
cp $HOME/github-repos/SPT-Fika-modded--Docker-Guide/files/Dockerfile $HOME/docker/containers/spt-fika-modded/fika/
cp $HOME/github-repos/SPT-Fika-modded--Docker-Guide/files/fcpy.sh $HOME/docker/containers/spt-fika-modded/fika/
cp $HOME/github-repos/SPT-Fika-modded--Docker-Guide/files/randomize_bg.sh $HOME/docker/containers/spt-fika-modded/fika/
cp $HOME/github-repos/SPT-Fika-modded--Docker-Guide/files/restart_fika.sh $HOME/docker/containers/spt-fika-modded/fika/

# Copy the SPT launcher background images folder to the fika directory
echo "Copying launcher images to the fika directory..."
cp -r "$HOME/github-repos/SPT-Fika-modded--Docker-Guide/files/SPT launcher images" $HOME/docker/containers/spt-fika-modded/fika/

echo "Pre-Setup complete. You can now proceed with the Docker container creation."

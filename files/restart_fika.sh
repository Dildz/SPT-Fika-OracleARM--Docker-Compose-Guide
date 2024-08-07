# restart_fika.sh

#!/bin/bash

# Define the name of the container
CONTAINER_NAME="modded-fika"

# Define the path to the log file
LOG_FILE="$HOME/docker/logs/modded-fika.log"

# Function to check if the Docker container is running
is_container_running() {
    docker inspect -f '{{.State.Running}}' $CONTAINER_NAME 2>/dev/null
}

echo "Checking if the $CONTAINER_NAME Docker container is running..."

# Stop the Docker container if it is running
if [ "$(is_container_running)" = "true" ]; then
    echo "$CONTAINER_NAME container is running. Stopping the container..."
    docker stop $CONTAINER_NAME

    # Wait for 10 seconds
    echo "Waiting for 10 seconds after stopping the container..."
    sleep 10
else
    echo "$CONTAINER_NAME container is not running. No need to stop it."
fi

# Capture the current timestamp
timestamp=$(date --iso-8601=seconds)
echo "Captured current timestamp: $timestamp"

# Clear the log file
echo "Clearing the log file..."
sudo : > "$LOG_FILE"

# Truncate the existing Docker logs
echo "Truncating the Docker logs for $CONTAINER_NAME..."
sudo truncate -s 0 $(docker inspect --format='{{.LogPath}}' $CONTAINER_NAME)

# Start the Docker container
echo "Starting the $CONTAINER_NAME Docker container..."
docker start $CONTAINER_NAME

echo "Logs are being written to $LOG_FILE"
echo "Tailing $CONTAINER_NAME logs in:"
sleep 1
echo "3"
sleep 1
echo "2"
sleep 1
echo "1"
sleep 1
docker logs $CONTAINER_NAME -f


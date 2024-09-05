# post_setup.sh

## This script will setup a cron task to restart the FIKA server using the restart_fika.sh script.
## The cron task will run once a day at midnight system time.
## Modify the cron task as needed to change the restart time, frequency and restart script location.

#!/bin/bash

echo "Running post_setup.sh ..."

# Set up the cron tasks to restart the FIKA server & change launcher background images
echo "Setting up the cron tasks to restart the FIKA server and change launcher background images..."

# Define the path to the scripts
RESTART_SCRIPT="/home/ubuntu/docker/containers/spt-modded-fika/files/restart_fika.sh"
BG_CHANGE_SCRIPT="/home/ubuntu/docker/containers/spt-modded-fika/files/randomize_bg.sh"

# Define the cron tasks
cron_task="0 2 * * * $RESTART_SCRIPT"
cron_task_bg="0 0 * * * $BG_CHANGE_SCRIPT"

# Add the cron tasks to the crontab, checking for existing entries to prevent duplicates
(crontab -l | grep -v -F "$RESTART_SCRIPT" ; echo "$cron_task") | crontab -
(crontab -l | grep -v -F "$BG_CHANGE_SCRIPT" ; echo "$cron_task_bg") | crontab -

echo "Cron tasks have been set up:
- FIKA server will restart daily at 2:00 AM.
- Launcher background images will change daily at midnight."
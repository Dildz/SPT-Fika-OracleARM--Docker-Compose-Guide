# fcpy.sh

#!/bin/bash
echo "MODDED FIKA Docker (SPT 3.9.1)"

LOGFILE="/home/ubuntu/docker/logs/modded-fika.log"

# Ensure the log directory exists and set permissions
mkdir -p /home/ubuntu/docker/logs
chmod 775 /home/ubuntu/docker/logs
chown ubuntu:ubuntu /home/ubuntu/docker/logs

# Clear the log file if it exists, or create it if it doesn't
> $LOGFILE
chmod 664 $LOGFILE
chown ubuntu:ubuntu $LOGFILE

if [ -d "/opt/srv" ]; then
    start=$(date +%s)
    echo "Started copying files to your volume/directory.. Please wait."
    cp -r /opt/srv/* /opt/server/
    rm -r /opt/srv
    end=$(date +%s)
    
    echo "Files copied to your machine in $(($end-$start)) seconds."
    echo "Starting the server to generate all the required files"
    cd /opt/server
    chown -R ubuntu:ubuntu ./*
    chmod -R 775 ./*
    sed -i 's/127.0.0.1/0.0.0.0/g' /opt/server/SPT_Data/Server/configs/http.json
    NODE_CHANNEL_FD= timeout --preserve-status 40s ./SPT.Server.exe </dev/null >/dev/null 2>&1 
    echo "Follow the instructions to proceed!"
    exit 0
fi

if [ -e "/opt/server/delete_me" ]; then
    echo "Error: Safety file found. Exiting."
    echo "Please follow the instructions."
    sleep 30
    exit 1
fi

cd /opt/server

# Start the server and log output to both stdout and the log file
./SPT.Server.exe 2>&1 | tee -a $LOGFILE &
SPT_SERVER_PID=$!

# Wait for the server process to end
wait $SPT_SERVER_PID

echo "Exiting."
exit 0

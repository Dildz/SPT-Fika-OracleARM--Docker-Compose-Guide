# fcpy.sh

#!/bin/bash
echo "MODDED FIKA Docker (SPT 3.9.0)"

LOGFILE="$HOME/docker/logs/modded-fika.log"

# Ensure the log directory exists
if [ ! -d "$HOME/docker/logs" ]; then
    mkdir -p "$HOME/docker/logs"
    chmod 777 "$HOME/docker/logs"
    echo "Log directory created and permissions set."
else
    echo "Log directory already exists."
fi

# Ensure the log file exists
if [ ! -f "$LOGFILE" ]; then
    touch "$LOGFILE"
    chmod 666 "$LOGFILE"
    echo "Log file created and permissions set."
else
    # Clear the log file if it exists
    > $LOGFILE
    echo "Log file cleared."
fi

if [ -d "/opt/srv" ]; then
    start=$(date +%s)
    echo "Started copying files to your volume/directory.. Please wait."
    cp -r /opt/srv/* /opt/server/
    rm -r /opt/srv
    end=$(date +%s)
    
    echo "Files copied to your machine in $(($end-$start)) seconds."
    echo "Starting the server to generate all the required files"
    cd /opt/server
    chown $(id -u):$(id -g) ./* -Rf
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
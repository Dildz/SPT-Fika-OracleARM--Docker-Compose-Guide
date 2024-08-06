# Setting up Fika SPT server with docker for Ubuntu on Oracle Cloud ARM instance
Last updated: 06/08/2024 | Dildz

**Make sure your oracle instance is 64-bit! Arm64 works too!**

[For support you should join the Fika Discord server](https://discord.gg/project-fika)

## Table Of Contents
[Installation](https://github.com/Dildz/SPT-Fika-modded--Docker-Guide#installing-docker)

[Updating The Server](https://github.com/Dildz/SPT-Fika-modded--Docker-Guide#updating-to-newer-versions)

[Other Possibly Helpful Info](https://github.com/Dildz/SPT-Fika-modded--Docker-Guide#modding-and-other-possibly-helpful-info)

## Free VPS
[A good free VPS from Oracle. It offers 24gb ram, 4 cores and 200gb of storage. It's ARM but works with this setup.](https://www.oracle.com/cloud/free/)

## Recommended tools
SSH:
[Putty](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)

File Explorer:
[WinSCP](https://winscp.net/eng/download.php)

My personal recommendation - SSH & File Explorer:
[VSCode](https://code.visualstudio.com/download) with the Remote Explorer extension installed.

## Installing Docker
First of all you need Docker. [You can download it by following this guide here.](https://docs.docker.com/engine/install/ubuntu/)
This guide is for ubuntu but you can find guides for other operating systems/distributions on their website.

You can verify your Docker installation by running `docker --version`

## Creating a working folder for docker
Create a new docker folder in the ubuntu home folder.
```
cd ~
```
```
mkdir docker
```
```
cd docker
```

## Setting up the directories
After you've got docker installed you can start by creating a new directory for your project and navigate to it in your terminal.

We're going to go ahead and create a new directory called "containers" and navigate to it.
You can do this with:
```
mkdir containers
```
```
cd containers
```

We're going to go ahead and create a new directory called "spt-fika-modded" and navigate to it.
You can do this with
```
mkdir spt-fika-modded
```
```
cd spt-fika-modded
```

We're going to create a new directories for our Fika Dockerfile and Fika SPT server and navigate to the Dockerfile directory.
You can do this with:
```
mkdir fika
```
```
mkdir server
```
```
cd fika
```

The file structure looks like this:

![file structure](images/fileStructure.png)

## Cloning the GitHub repository
Now we're going to clone the SPT-Fika-modded--Docker-Guide [(This is a fork, original from OnniSaarni Docker Guide)](https://github.com/OnniSaarni/SPT-Fika-Docker-Guide)
First we create a github-repos directory.

You can do this with:
```
cd ~
```
```
mkdir github-repos
```

Then we clone the repository inside the github-repos folder.

You can do this with:
```
cd github-repos
```
```
git clone https://github.com/Dildz/SPT-Fika-modded--Docker-Guide.git
```

## Copying the files
Now we're going to copy the files from github-repos/SPT-Fika-modded--Docker-Guide folder to the docker container location.

You can do this with:
```
cp $HOME/github-repos/SPT-Fika-modded--Docker-Guide/files/Dockerfile $HOME/docker/containers/spt-fika-modded/fika/
```
```
cp $HOME/github-repos/SPT-Fika-modded--Docker-Guide/files/fcpy.sh $HOME/docker/containers/spt-fika-modded/fika/
```
```
cp $HOME/github-repos/SPT-Fika-modded--Docker-Guide/files/restart_fika.sh $HOME/docker/containers/spt-fika-modded/fika/
```

You should now have the Dockerfile, fcpy.sh and restart_fika.sh copied to the spt-fika-modded/fika/ folder ready for the setup.

## Setting up the Docker container
First off, we're going to run this in the "fika" directory to build the container:
```
cd $HOME/docker/containers/spt-fika-modded/fika
```
```
docker build --no-cache --label modded-fika -t modded-fika .
```

It will take a while but once it is finished we are going to move on to the next command. 

**In the next command need to change to the server directory path.**
You can navigate to the "server" directory by running:
```
cd ..
```
```
cd server
```

Then we will run the container with the following command:
```
docker run --pull=never -v $HOME/docker/containers/spt-fika-modded/server:/opt/server -v $HOME/docker/logs:$HOME/docker/logs -p 6969:6969 -p 6970:6970 -p 6971:6971 -it --name modded-fika --log-opt max-size=10m --log-opt max-file=3 modded-fika
```

## Starting the container
Start the container once & view live logs using:
```
cd ~
```
```
docker start modded-fika
```
```
docker logs modded-fika -f
```
Once the server has started we can set restart behavior & stop the server using:
**Ctrl + C** to exit the logs when server is ready:
```
docker update --restart unless-stopped modded-fika
```
(This makes sure that the container will restart if stopped unexpectedly)
Now stop the server using:
**Ctrl + C** to exit the live logs
```
docker stop modded-fika
```

## Copying the "mod-pack"
List of mods used in this "mod-pack" [(Google Doc Link)](https://docs.google.com/document/d/1eBul9mYMUJPAPbLsmKR8M5sK6DMl647HM87JrKmG2Vg/edit)

Now we can run the modscpy.sh script **as sudo** to copy the mod-pack:
```
sudo $HOME/github-repos/SPT-Fika-modded--Docker-Guide/files/modscpy.sh
```
With the mods & configs copied we can now start the server using the restart script:
```
$HOME/docker/containers/spt-fika-modded/fika/restart_fika.sh
```
(This restart script will stop/start the server, clear modded-fika.log & display the logs in real-time)

You can see the logs again at any time with the `docker logs modded-fika -f` command.

Logs can also be accessed in the $HOME/docker/logs folder for further processing with a discord bot, which can also be hosted on the same Oracle VPS.
(for example - I wrote a bot for my discord that updates an embed message every 10sec showing the server status / players online / active raid map & time / time to next reboot in hours, this way other players can quickly see if the fika server is online, who is online & if a raid is active).
Note - The modded-fika container logs are cleared each time the restart_fika.sh script runs.

## Creating a cron reboot job
To have the modded-fika server auto-reboot daily, we will create a new cron-job:
```
cd ~
```
```
contab -e
```

Add the following to the end of the file:
**make sure to replace [USERNAME] with your username**
```
# MODDED-FIKA docker server reboot - 2am daily
0 2 * * * /home/USERNAME/docker/containers/spt-fika-modded/fika/restart_fika.sh
```

If using nano editor:
Press **Ctrl + O** (you will be prompted to save the file-name)
Press **Enter** to save
Press **Ctrl + X** to exit

This creates a task to reboot the modded-fika server every day at 2am according to the system time - change the "2" value to an hour that suits your needs in the 24hr format.

## Starting mods for new players
Any new players to the modded-fika server will need to have a fresh SPT install with the following mods pre-installed before connecting:

1: [(FIKA client only)](https://github.com/project-fika/Fika-Plugin/releases)

2: [(Corter-ModSync client only)](https://github.com/c-orter/modsync)

## Editing player profiles
You will find the new profiles that get created when players join will be permission locked to the root user and you won't be able to save changes.
To make changes to player HP / Energy / Hydration for example we need to run the following commands:
**Change [PROFILE_ID] to the ID of the profile you want to edit**
**Change [USERNAME] to your system username**

First stop the modded-fika server:
```
docker stop modded-fika
```

Then we will change the profile permissions:
```
sudo chmod 775 $HOME/docker/containers/spt-fika-modded-new/server/user/profiles/PROFILE_ID.json
```
**make sure to replace [USERNAME] with your username**
```
sudo chown USERNAME:USERNAME $HOME/docker/containers/spt-fika-modded-new/server/user/profiles/PROFILE_ID.json
```

Using something like WinSCP or (my personal fav) VSCode with Remote Explorer plugin - Browse to & open the profile / Make changes & save / Start the modded-fika server

## Helpful Docker commands
View container logs:
```
docker logs modded-fika -f
```
Press **Ctrl + C** to exit the logs.
Stop the container:
```
docker stop modded-fika
```

To start/restart the container:
```
$HOME/docker/containers/spt-fika-modded/fika/restart_fika.sh
```

See the commands.txt file for a full list of commands used.

## Updating to newer versions
First you will have to stop the server:
```
docker stop modded-fika
```

[Creating a backup script](https://gist.github.com/OnniSaarni/a3f840cef63335212ae085a3c6c10d5c#setting-up-the-docker-container)
-- see ahandleman's comment re: bash script to backup mods/profiles & updating

It is recommended to backup your players profiles and the BepInEx / user mods folders.
You can copy them to your container backup directory with these commands:
```
mkdir -p $HOME/docker/backups/spt-fika-modded-backup/user/profiles
```
```
mkdir -p $HOME/docker/backups/spt-fika-modded-backup/user/mods
```
```
mkdir -p $HOME/docker/backups/spt-fika-modded-backup/BepInEx
```
```
cp -r $HOME/docker/containers/spt-fika-modded/server/BepInEx/* $HOME/docker/backups/spt-fika-modded-backup/BepInEx
```
```
cp -r $HOME/docker/containers/spt-fika-modded/server/user/profiles/* $HOME/docker/backups/spt-fika-modded-backup/user/profiles
```
```
cp -r $HOME/docker/containers/spt-fika-modded/server/user/mods/* $HOME/docker/backups/spt-fika-modded-backup/user/mods
```

Now we need to remove the old version of FIKA server mod from the backup using:
```
rm -rf $HOME/docker/backups/spt-fika-modded-backup/user/mods/fika-server
```
(the latest FIKA will be installed when we rebuild the container)

Next we need to delete the container and the image. We can do that by running these commands one at a time:
List containers:
```
docker ps -a
```
Remove container:
```
docker rm modded-fika
```
List images:
```
docker images
```
Remove image:
```
docker rmi modded-fika
```
Prune images:
```
docker image prune
```
Remove contents of server directory:
```
sudo rm -rf $HOME/docker/containers/spt-fika-modded/server/*
```
**!!Before rebuilding the server - you MUST update the version numbers for FIKA & SPT to the latest versions in the dockerfile!!**
Now we can rebuild the container:
```
cd $HOME/docker/containers/spt-fika-modded/fika
```
```
docker build --no-cache --label modded-fika -t modded-fika .
```

Move to the server directory:
```
cd ..
```
```
cd server
```
```
docker run --pull=never -v $HOME/docker/containers/spt-fika-modded/server:/opt/server -v $HOME/docker/logs:$HOME/docker/logs -p 6969:6969 -p 6970:6970 -p 6971:6971 -it --name modded-fika --log-opt max-size=10m --log-opt max-file=3 modded-fika
```

Now we start the container to make sure we verify the build:
```
docker start modded-fika
```
Set the restart behavior:
```
docker update --restart unless-stopped modded-fika
```
Check the logs:
```
docker logs modded-fika -f
```
When the server is ready - exit logs with **Ctrl + C** and run:
```
docker stop modded-fika
```

Then run the following command to change the permissions for the profiles and mods folders.
**Change [USERNAME] to your system username**
```
sudo chmod -R 775 $HOME/docker/containers/spt-fika-modded/server/user/profiles
```
```
sudo chown -R USERNAME:USERNAME $HOME/docker/containers/spt-fika-modded/server/user/profiles
```
```
sudo chmod -R 775 $HOME/docker/containers/spt-fika-modded/server/user/mods
```
```
sudo chown -R USERNAME:USERNAME $HOME/docker/containers/spt-fika-modded/server/user/mods
```

Now you can restore the backed up profiles and server mods.
To do that run the following commands:
```
cp -r $HOME/docker/backups/spt-fika-modded-backup/server/user/profiles/* $HOME/docker/containers/spt-fika-modded/server/user/profiles/
```
```
cp -r $HOME/docker/backups/spt-fika-modded-backup/server/user/mods/* $HOME/docker/containers/spt-fika-modded/server/user/mods/
```
Make the BepInEx folder in the server directory:
```
mkdir -p $HOME/docker/containers/spt-fika-modded/server/BepInEx
```
Restore the client mods:
```
cp -r $HOME/docker/backups/spt-fika-modded-backup/BepInEx/* $HOME/docker/containers/spt-fika-modded/server/BepInEx/
```

Once the mods & profiles are restored, start the server with:
```
sudo $HOME/docker/containers/spt-fika-modded/fika/restart_fika.sh
```

Now your server is updated.

[To update your client you can follow the instructions here.](https://dev.sp-tarkov.com/SPT/Stable-releases/releases)
[Or follow the ReadMe file in the G-Drive folder to do a fresh client install.](https://drive.google.com/drive/folders/15wUVnloywf1qb9tNZQtZlkXKX_GSR87t?usp=sharing)
[You will also need to download the newest Fika plugin from here.](https://github.com/project-fika/Fika-Plugin/releases)

## Other possibly helpful info
To play with friends you have several options:
ZeroTier One
RADMIN VPN
Direct connection with port forwarding
[More info over here](https://github.com/project-fika/Fika-Documentation?tab=readme-ov-file#installation)

I prefer using ZeroTier One, I've found this to be the most "hassle-free" experience for players.
ZeroTier doesn't require players to have to force bind IP's or do any port forwarding as a host - as long as the ZT network is set a private network - "it just works"

[Making automatic backups with cron](https://unix.stackexchange.com/a/16954)

## Updating or adding user & client mods
To update or add mods, you have to put them in the server's "server/user/mods" and "server/BepInEx" directories respectively.
Since Corter-Modsync is used in this "mod-pack" - any new or updated mods & configs will get synced to the clients when they connect to the server.

For new/updated client (BepInEx) mods:
- as the server owner - you will need to open your game to get the modsync updates, then make any config changes in the F12 menu
- once your F12 config changes have been made, copy the mod's .cfg file from your PC's SPTarkov/BepInEx/config folder to the server's "server/BepInEx/config/" directory (using something like WinSCP or VSCode)

For new/updated server (user) mods:
- stop the FIKA server
- copy any new or updated mods to the server's "server/user/mods" directory (using something like WinSCP or VSCode)
- make any config changes you need (for Realism - download the mod & run the config tool on your PC then replace the config file on the server)
- start the FIKA server with the restart script

**Note - not all mods are FIKA compatible - see the FIKA discord's FAQ for a list of incompatible mods.**

Existing players don't need to re-install SPT - they just need to download the latest SPT files from the Direct Download link on the [SPT Update page](https://dev.sp-tarkov.com/SPT/Stable-releases/releases) and replace the files in their SPTarkov install folder.

## Errors/Issues
Some errors are fixed by deleting all the files in the "cache" directory.

A lot of the issues can be fixed by just searching the Fika Discord server for the error.
Try to find an answer before asking one - someone has probably had your error before.

If players are spawning apart from each other with the spawn together setting ON in the game settings when starting raids - someone has an mismatched FIKA version or the server isn't on the correct version.
Make sure the server's FIKA client & server mod-files are on the latest version by replacing user & client files, reboot server & have all players reconnect.
Corter-Modsync will push the update when players re-join.

If you have added new mods & players are not loading or any other new issues - check the logs and see which mod/s are causing problems & remove them.
Remember to restart the server each time.

## Credits
[Special thanks to k2rlxyz for making the original Dockerfile.](https://hub.docker.com/r/k2rlxyz/fika). It can also be found in the [Discord](https://discord.gg/project-fika).
[Special thanks to OnniSaarni for making the original SPT-Fika-Docker-Guide.](https://github.com/OnniSaarni/SPT-Fika-Docker-Guide).

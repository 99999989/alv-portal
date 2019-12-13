#!/bin/bash

#APT_SIGNING_KEY_URL=https://dl-ssl.google.com/linux/linux_signing_key.pub
#APT_SOURCES_ENTRY="deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main"
#
#echo "Installing chrome..."
#
#wget -q -O - $APT_SIGNING_KEY_URL | sudo apt-key add -
#sudo sh -c 'echo "$APT_SOURCES_ENTRY" >> /etc/apt/sources.list.d/google.list'
#sudo apt-get update
#sudo apt-get install google-chrome-stable

wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb

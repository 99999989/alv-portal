#!/bin/bash

# workaround: on a travis VM, it is required to load the nvm function before using nvm/node (maven build calls npm)
source ~/.nvm/nvm.sh

echo "Building Maven artifacts..."
./mvnw --settings ./.mvn/wrapper/settings.xml package -DskipITs=true

#!/bin/bash

if [ $# -eq 0 ]; then
  ENV_SLUG=local
else
  ENV_SLUG=$1
fi

echo "Undeploying docker compose YML for the environment: '$ENV_SLUG'..."

env $(cat "./../conf/$ENV_SLUG.env" | xargs) docker-compose -f ./../docker-compose.yml down

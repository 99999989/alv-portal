#!/bin/bash

BUILD_VERSION=$1
GIT_USER=$2
GIT_PWD=$3
GIT_PROJECT_NAME="central-deployment"
GIT_REPO_URL="https://$GIT_USER:$GIT_PWD@github.com/alv-ch/$GIT_PROJECT_NAME.git"
VERSION_FILE="group_vars/dev/versions.yml"

echo "Using project version: $BUILD_VERSION..."
echo "Using git user email: $GIT_USER..."
echo "Using git user password: $GIT_PWD..."

git clone $GIT_REPO_URL

# replace the version
cd $GIT_PROJECT_NAME
sed -i 's/portal_version.*/portal_version\: $BUILD_VERSION/' $VERSION_FILE

# push changes
git commit -m "portal_version bump to $BUILD_VERSION" $VERSION_FILE
git push

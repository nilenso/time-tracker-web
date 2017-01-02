#!/bin/bash

DEPLOY_DIR=/home/enso
GIT_REPO_DIR=${DEPLOY_DIR}/time-tracker-web
set -ex

cd $GIT_REPO_DIR
git pull
npm install
source ../ui-env
nodejs scripts/build.js
sudo rm -rf /var/www/*
sudo cp -R build/* /var/www

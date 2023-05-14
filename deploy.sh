#! /bin/bash

yarn install
npm run build:test

cp -rf ./dist/* ../public/
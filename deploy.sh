#!/usr/bin/env bash
cd ./server
sudo npm start &
cd ../
cd ./client
sudo ng serve

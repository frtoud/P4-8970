#!/usr/bin/env bash
sudo mongod -bind_ip_all --port 27017 --dbpath /data/db &
cd server
sudo npm start &
cd ../client
sudo ng serve --verbose=false --host 0.0.0.0 --port 4200 --disable-host-check &

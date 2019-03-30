#!/usr/bin/env bash
cd server
sudo npm start &
cd ../client/src/app
sudo rm ./config.ts
sudo cat <<EOF > ./config.ts
export class Config {
    public static apiUrl = 'http://localhost:8000';
  }
EOF
cd ../../../
sudo mongo < db-admin.js
cd ./client
sudo ng serve --host 0.0.0.0 --port 4200 --disable-host-check &

#!/usr/bin/env bash
cd ./server
sudo npm install
cd lib
sudo touch keys.js
sudo cat <<EOF > ./keys.js
const KEYS = {
    mongo: {},
    mailer: {
        from: "gigl-projet-a@polymtl.ca"
    },
    host: "http://localhost:8000"
};
module.exports = KEYS; 
EOF
sudo npm start &
cd ../../client/src/app
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

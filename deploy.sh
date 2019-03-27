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
    host: "http://localhost:443"
};
module.exports = KEYS; 
EOF
pwd
sudo npm start &
cd ../../client
sudo ng serve --host 0.0.0.0 --port 80 --disable-host-check &

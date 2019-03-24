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
pwd
sudo npm start &
cd ../../client
sudo ng serve &

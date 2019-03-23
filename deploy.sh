#!/usr/bin/env bash
#Note: option to install without prompting for yes/no

#Install Git

sudo yum install git

#Install Node

#-- Step 1 - Add Node.js Yum Repository (Stable) --
sudo yum install -y gcc-c++ make
sudo curl -sL https://rpm.nodesource.com/setup_10.x | sudo -E bash -

#-- Step 2 – Install Node.js on CentOS --
sudo yum install nodejs

#XXXXXXX Angular CLI XXXXXXXX

npm install -g @angular/cli

#XXXXXXX Install Angular Packages XXXXXXXX
sudo su
sudo npm install

# npm audit fix/npm audit fix --force


#XXXXXXX Create keys.js XXXXXXXX
cd lib
touch keys.js
cat <<EOF > ./keys.js
const KEYS = {
    mongo: {},
    mailer: {
        from: "gigl-projet-a@polymtl.ca"
    },
    host: "http://localhost:8000"
};
module.exports = KEYS; 
EOF

#!/usr/bin/env bash

#Install Git
#sudo yum -y install git

#Install Node
#-- Step 1 - Add Node.js Yum Repository (Stable) --
sudo yum -y install -y gcc-c++ make
sudo curl -sL https://rpm.nodesource.com/setup_10.x | sudo -E bash -

#-- Step 2 – Install Node.js on CentOS --
sudo yum -y install nodejs

#Install Angular CLI

npm install -g @angular/cli

#Install Angular Packages
sudo su
sudo npm install

# npm audit fix/npm audit fix --force
#Create keys.js
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

#Install MongoDB
cd /
cd etc/yum -y.repos.d/
touch mongodb-org-4.0.repo
cat <<EOF > ./mongodb-org-4.0.repo.js
[mongodb-org-4.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum -y/redhat/$releasever/mongodb-org/4.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.0.asc
EOF
sudo yum -y install -y mongodb-org
sudo service mongod start
# Enable mongod daemon on boot.
sudo systemctl enable mongod

#Reboot the system.
sudo reboot



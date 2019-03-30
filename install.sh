#!/usr/bin/env bash

#-- Add Node.js Yum Repository (Stable) --
sudo yum -y install -y gcc-c++ make
sudo curl -sL https://rpm.nodesource.com/setup_10.x | sudo -E bash -

#-- Install Node.js on CentOS --
sudo yum -y install nodejs

#Install Angular CLI
sudo npm install -g @angular/cli

#Install Angular Packages
sudo npm install

#Create keys.js
cd ./server/lib
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

#Install MongoDB
cd /
cd etc/yum -y.repos.d/
sudo touch mongodb.repo
sudo cat <<EOF > ./mongodb.repo
[mongodb]
name=MongoDB Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64/
gpgcheck=0
enabled=1
#[mongodb-org-4.0]
#name=MongoDB Repository
#baseurl=https://repo.mongodb.org/yum -y/redhat/$releasever/mongodb-org/4.0/x86_64/
#gpgcheck=1
#enabled=1
#gpgkey=https://www.mongodb.org/static/pgp/server-4.0.asc
EOF
sudo yum -y install -y mongodb-org
sudo service mongod start

# Enable mongod daemon on boot.
sudo systemctl enable mongod
sudo systemctl enable firewalld
sudo systemctl start firewalld
sudo firewall-cmd --zone=public --add-port=8000/tcp --permanent
sudo firewall-cmd --zone=public --add-port=4200/tcp --permanent
sudo firewall-cmd --zone=public --add-port=27017/tcp --permanent
sudo firewall-cmd --reload
echo "Le système doit redémarrer pour compléter l'installation. Voulez-vous continuer?"
select yn in "Oui" "Non"; do
    case $yn in
        Oui ) sudo reboot;
    esac
done




#!/usr/bin/env bash

# Uninstall node modules.
cd ./server/node_modules/
sudo npm uninstall *
cd ./client/node_modules/
sudo npm uninstall *

# Uninstall Node.js.
sudo yum -y remove nodejs

# Uninstall MongoDB.
sudo service mongod stop
sudo yum -y erase $(rpm -qa | grep mongodb-org)
sudo rm -r /var/log/mongodb
sudo rm -r /var/lib/mongo


#!/bin/bash
if ! [ -x "$(command -v dialog)" ]; then
    echo "La librairie dialog est nécessaire. Installation..."
    yum -y -q install dialog
    echo "Lancement de l'installeur..."
fi
cmd=(dialog --separate-output --checklist "Bienvenue dans l'installeur de Polyforms. Les programmes suivants sont nécessaires. Les programmes présélectionnés ne sont pas installés sur votre ordinateur. Appuyer sur ESPACE pour sélectionner." 22 76 16)
ISINSTALLED1=off
ISINSTALLED2=off
ISINSTALLED3=off
ISINSTALLED4=off
ISINSTALLED5=off
ISINSTALLED6=off
if ! [ -x "$(command -v gcc-c++)" ]; then
    ISINSTALLED1=on
fi
if ! [ -x "$(command -v nodejs)" ]; then
    ISINSTALLED2=on
fi
if ! [ -x "$(command -v ng)" ]; then
    ISINSTALLED3=on
fi
if ! [ -x "$(command -v tsc)" ]; then
    ISINSTALLED4=on
fi
if ! [ -x "$(command -v mongo)" ]; then
    ISINSTALLED5=on
fi
if ! [ -x "$(command -v make)" ]; then
    ISINSTALLED6=on
fi
options=(1 "gcc-c++" $ISINSTALLED1
         2 "Node.js" $ISINSTALLED2
         3 "Angular CLI" $ISINSTALLED3
         4 "Typescript" $ISINSTALLED4
         5 "MongoDB" $ISINSTALLED5
         6 "make" $ISINSTALLED6)
choices=$("${cmd[@]}" "${options[@]}" 2>&1 >/dev/tty)
clear
for choice in $choices
do
    case $choice in
        1)
            sudo yum -y -q install gcc-c++
            ;;
        2)
            sudo curl -sL https://rpm.nodesource.com/setup_10.x | sudo -E bash -
            sudo yum -y -q install nodejs
            ;;
        3)
            sudo npm install --silent -g @angular/cli
            sudo npm install --silent @angular-devkit/build-angular
            sudo npm install --silent @angular/compiler-cli
            sudo npm install --silent @angular/compiler
            ;;
        4)
            sudo npm install --silent -g typescript
            ;;
        5)
            cd /
            cd etc/yum.repos.d/
            sudo touch mongodb-org-4.0.repo
            REPODIR=./mongodb-org-4.0.repo
            MONGOREPO=$'[mongodb-org-4.0]\nname=MongoDB Repository\nbaseurl=https://repo.mongodb.org/yum/redhat/7/mongodb-org/4.0/x86_64/\ngpgcheck=1\nenabled=1\ngpgkey=https://www.mongodb.org/static/pgp/server-4.0.asc'
            echo "$MONGOREPO" > "$REPODIR"
            sudo yum -y -q -q install mongodb-org
            sudo npm install --silent mongodb
            sudo systemctl enable mongod
            ;;
         6)
            if ! [ -x "$(command -v make)" ]; then
                sudo yum -y -q install make
            fi
    esac
done
cd ~/projet4/server/lib
sudo touch keys.js
sudo cat <<EOF > ./keys.js
const KEYS = {
    mongo: {},
    mailer: {
        from: "gigl-projet-a@polymtl.ca"
    },
    host: "http://localhost:4200"
};
module.exports = KEYS;
EOF
cd ~/projet4/client/src/app
sudo cat <<EOF > ./config.ts
export class Config {
    public static apiUrl = 'http://localhost:8000';
  }
EOF
cd ~/projet4
sudo npm install --save mongodb
cd ./client
sudo npm install
cd ../server
sudo npm install
cd ..
sudo systemctl enable firewalld
sudo systemctl start firewalld
sudo firewall-cmd --zone=public --add-port=8000/tcp --permanent
sudo firewall-cmd --zone=public --add-port=4200/tcp --permanent
sudo firewall-cmd --zone=public --add-port=27017/tcp --permanent
sudo firewall-cmd --reload
sudo mongod -bind_ip_all --port 27017 --dbpath /data/db
sudo node ./db-admin.js &
sudo fuser -k 27017/tcp
cd /
if [ -d "data" ]; then
    sudo mkdir data
    sudo chmod -R go+w data
    cd data
    if [ -d "db" ]; then
        sudo mkdir db
        sudo chmod -R go+w db
    fi
fi

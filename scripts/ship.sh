#!/bin/bash
cd ./client
sudo ng config -g cli.wanings.versionMismatch false
sudo npm install
sudo cp -rf ./dist/projet4/. /var/www/html
if ! [ -x "$(command -v epel-release)" ]; then
    sudo yum -y install epel-release
fi
if ! [ -x "$(command -v nginx)" ]; then
    sudo yum -y install nginx
fi
SERVICE="nginx"
if pgrep -x "$SERVICE" >/dev/null
then
    echo "$SERVICE is running"
else
    echo "$SERVICE stopped"
    systemctl start nginx
fi
sudo firewall-cmd --permanent --zone=public --add-service=http
sudo firewall-cmd --permanent --zone=public --add-service=https
sudo firewall-cmd --reload
cd /etc/nginx/nginx.conf
CONFIGFILE=./nginx.conf
TARGETKEY=server
REPLACEMENTVALUE=$'server{ \nlisten 8080;\nserver_name  http://localhost;\nroot   /var/www/html;\nindex  index.html index.htm;\nlocation / {\ntry_files $uri $uri/ /index.html;\n}'
sed -i "s/\($TARGETKEY *= *\).*/\1$REPLACEMENTVALUE/" $CONFIGFILE




#!/usr/bin/env bash
cmd=(dialog --separate-output --checklist "Appuyer sur ESPACE pour sélectionner les programmes à désinstaller. Les programmes présélectionnés sont installés présentement sur votre ordinateur." 22 76 16)
ISINSTALLED1=on
ISINSTALLED2=on
ISINSTALLED3=on
ISINSTALLED4=on
ISINSTALLED5=on
ISINSTALLED6=on
if ! [ -x "$(command -v gcc-c++)" ]; then
    ISINSTALLED1=off
fi
if ! [ -x "$(command -v nodejs)" ]; then
    ISINSTALLED2=off
fi
if ! [ -x "$(command -v ng)" ]; then
    ISINSTALLED3=off
fi
if ! [ -x "$(command -v tsc)" ]; then
    ISINSTALLED4=off
fi
if ! [ -x "$(command -v mongo)" ]; then
    ISINSTALLED5=off
fi

if ! [ -x "$(command -v make)" ]; then
    ISINSTALLED6=off
fi
options=(1 "gcc-c++" $ISINSTALLED1
         2 "Node.js" $ISINSTALLED2
         3 "Angular CLI" $ISINSTALLED3
         4 "Typescript" $ISINSTALLED4
         5 "MongoDB" $ISINSTALLED5
         6 "make" $ISINSTALLED6)
choices=$("${cmd[@]}" "${options[@]}" 2>&1 >/dev/tty)
clear
cd node_modules
sudo npm uninstall *
for choice in $choices
do
    case $choice in
        1)
            sudo yum -y remove gcc-c++
            ;;
        2)
            sudo yum -y remove nodejs
            ;;
        3)
            ;;
        4)
            ;;
        5)
            sudo service mongod stop
            sudo yum -y erase $(rpm -qa | grep mongodb-org)
            sudo rm -r /var/log/mongodb
            sudo rm -r /var/lib/mongo
            ;;
        6)
            sudo yum -y remove make
            ;;
    esac
done
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    sudo fuser -k 8000/tcp
fi
if lsof -Pi :4200 -sTCP:LISTEN -t >/dev/null ; then
    sudo fuser -k 4200/tcp
fi
sudo killall node



#!/usr/bin/env bash
cmd=(dialog --separate-output --checklist "Appuyer sur ESPACE pour sélectionner les programmes à installer. Les programmes présélectionnés sont installés sur votre ordinateur." 22 76 16)
ISINSTALLED1=on
ISINSTALLED2=on
ISINSTALLED3=on
ISINSTALLED4=on
ISINSTALLED5=on
ISINSTALLED6=on
if  [! -x "$(command -v gcc-c++)" ]; then
    ISINSTALLED1=off
fi
if  [! -x "$(command -v nodejs)" ]; then
    ISINSTALLED2=off
fi
if  [! -x "$(command -v ng)" ]; then
    ISINSTALLED3=off
fi
if [! -x "$(command -v tsc)" ]; then
    ISINSTALLED4=off
fi
if  [! -x "$(command -v mongo)" ]; then
    ISINSTALLED5=off
fi

options=(1 "gcc-c++" $ISINSTALLED1
         2 "Node.js" $ISINSTALLED2
         3 "Angular CLI" $ISINSTALLED3
         4 "Typescript" $ISINSTALLED4
         5 "MongoDB" $ISINSTALLED5)

choices=$("${cmd[@]}" "${options[@]}" 2>&1 >/dev/tty)
clear
cd ~/projet4/client
sudo npm uninstall *
cd ~/projet4/server
sudo npm uninstall *
cd ~/projet4
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
            sudo npm uninstall -g @angular/cli
            sudo npm cache clean
            ;;
        4)
            sudo npm uninstall -g typescript
            ;;
        5)
            sudo service mongod stop
            sudo yum -y erase mongo-10gen mongo-10gen-server
            ;;
    esac
done
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    sudo fuser -k 8000/tcp
fi
if lsof -Pi :4200 -sTCP:LISTEN -t >/dev/null ; then
    sudo fuser -k 4200/tcp
fi
if lsof -Pi :27017 -sTCP:LISTEN -t >/dev/null ; then
    sudo fuser -k 27017/tcp
fi
sudo killall node



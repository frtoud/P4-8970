#!/usr/bin/env bash
sudo wget --no-check-certificate 'https://docs.google.com/uc?export=download&id=1BJlp4udnEZUb71bhf9FagPdwE7vu0qml' -O polyforms.tar.gz
sudo tar xvzf polyforms.tar.gz
cd polyforms
sudo chmod +x ./deploy.sh
sudo chmod +x ./install.sh
sudo chmod +x ./stop.sh
sudo chmod +x ./uninstall.sh
sudo ./install.sh

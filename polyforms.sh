#!/usr/bin/env bash
sudo wget --no-check-certificate 'https://docs.google.com/uc?export=download&id=1JgmX85txC-WyEaJAQZQQAIgfezjDXIR8' -O polyforms.tar.gz
sudo tar xvzf polyforms.tar.gz
cd projet4
sudo chmod +x ./deploy.sh
sudo chmod +x ./install.sh
sudo chmod +x ./stop.sh
sudo chmod +x ./uninstall.sh
sudo ./install.sh

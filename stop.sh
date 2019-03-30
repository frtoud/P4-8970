#!/usr/bin/env bash

sudo fuser -k 8000/tcp
sudo fuser -k 4200/tcp
sudo killall node

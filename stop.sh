#!/usr/bin/env bash

fuser -k 4200/tcp
fuser -k 8000/tcp
sudo killall node

#!/usr/bin/env bash

fuser -k 443/tcp
fuser -k 80/tcp
sudo killall node

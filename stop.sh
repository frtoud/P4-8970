#!/usr/bin/env bash
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    sudo fuser -k 8000/tcp
fi
if lsof -Pi :4200 -sTCP:LISTEN -t >/dev/null ; then
    sudo fuser -k 4200/tcp
fi
sudo killall node

#!/bin/bash
./wait-for-it.sh 127.0.0.1:5672 -t 60
./wait-for-it.sh 127.0.0.1:5432 -t 60
python ./DataMessageRouter.py

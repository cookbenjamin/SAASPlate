#!/bin/bash
./wait-for-it.sh 127.0.0.1:5672
./wait-for-it.sh 127.0.0.1:5432
python ./DataMessageRouter.py
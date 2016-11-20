import os

os.system("docker build -t saas-logic ./AppLogic")
os.system("docker build -t saas-db ./MicroServices/DB")
os.system("docker-compose up")
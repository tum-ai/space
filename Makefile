$PHONY: install init_venv run_docker run_api run

RED=\033[0;31m
GREEN=\033[0;32m
NC=\033[0m

install:
	# next js
	curl -sL https://deb.nodesource.com/setup_14.x | sudo -E /bin/bash
	sudo apt-get install nodejs -y
	
	# python3.10
	printf "${RED}TODO: Please intall Python3.10 ${NC}\n"
	python3.10 --version

init_venv:
	python3.10 -m venv venv
	. venv/bin/activate
	python3.10 -m pip install -r api/requirements.txt
	printf "${RED}TODO: ${NC} >> ${GREEN}. venv/bin/activate${NC}\n"

run_docker:
	sudo docker-compose up -d

run_api:
	uvicorn api.server.app:app --reload --port 15900 --host 0.0.0.0

run: run_docker run_api

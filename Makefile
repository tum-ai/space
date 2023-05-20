
run-db:  # for running api locally outside of docker
	sudo docker-compose up --build --remove-orphans -d space-db

run:
	sudo docker-compose up --build --remove-orphans -d

run-skip-build:  # does not rebuild the api image
	sudo docker-compose up --remove-orphans -d

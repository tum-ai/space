

projects-list:
	firebase projects:list

build:
	npm run build

switch2staging:
	firebase use tumai-space-staging

switch2prod:
	firebase use tumai-space

start-emulators:
	firebase emulators:start

deploy-staging: switch2staging build
	# TODO: change this line in firebase_auth.this
	# const app = initializeApp(firebaseConfig);
	firebase deploy

deploy-prod: switch2prod build
	# TODO: change this line in firebase_auth.this
	# const app = initializeApp(firebaseConfigStaging);
	firebase deploy

deploy: deploy-staging

dev: switch2staging  # todo make 3. dev project
	npm run start

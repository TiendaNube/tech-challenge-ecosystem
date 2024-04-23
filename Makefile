start:
	docker compose up --build

start-daemon:
	docker compose up -d --build

run-tests:
	pip install -r requirements.txt -r requirements.dev.txt --upgrade
	pytest
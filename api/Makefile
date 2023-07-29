.PHONY: lint lint-fix test

PYTHONPATH=$(CURDIR)

lint:
	python -m ruff check .
	# MYPYPATH=${PYTHONPATH} PYTHONPATH=${PYTHONPATH} mypy --namespace-packages --explicit-package-bases .

lint-fix:
	python -m ruff check . --fix

test:
	PYTHONPATH=${PYTHONPATH} pytest

build:
	docker-compose build --no-cache
	docker-compose up -d

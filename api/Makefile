.PHONY: lint lint-fix test

PYTHONPATH=$(CURDIR)

lint:
	PYTHONPATH=${PYTHONPATH} black --check .
	PYTHONPATH=${PYTHONPATH} isort --check-only .
	PYTHONPATH=${PYTHONPATH} flake8 .
	# MYPYPATH=${PYTHONPATH} PYTHONPATH=${PYTHONPATH} mypy --namespace-packages --explicit-package-bases .

lint-fix:
	PYTHONPATH=${PYTHONPATH} black .
	PYTHONPATH=${PYTHONPATH} isort .

test:
	PYTHONPATH=${PYTHONPATH} pytest

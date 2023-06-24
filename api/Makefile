.PHONY: lint lint-fix test

PYTHONPATH=$(CURDIR)

lint:
	python -m ruff check space_api tests
	# MYPYPATH=${PYTHONPATH} PYTHONPATH=${PYTHONPATH} mypy --namespace-packages --explicit-package-bases .

lint-fix:
	python -m ruff check . --fix

test:
	PYTHONPATH=${PYTHONPATH} pytest

.PHONY: lint lint-fix


lint:
	black --check .
	isort --check-only .
	flake8 .
	mypy .

lint-fix:
	black .
	isort .

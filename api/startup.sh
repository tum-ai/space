# For Azure deployment start API:

PYTHONPATH=. gunicorn main:app -k uvicorn.workers.UvicornWorker --workers=4 --reload --bind=0.0.0.0

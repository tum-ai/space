# For Azure deployment start API:

PYTHONPATH=./api/ gunicorn api.main:app -k uvicorn.workers.UvicornWorker --workers=4 --reload --bind=0.0.0.0

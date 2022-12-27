import uvicorn
# import logging

# TODO: Add logging
# logger = logging.getLogger(__name__)
# logger.setLevel(logging.DEBUG)

if __name__ == "__main__":
    uvicorn.run("server.app:app", host="0.0.0.0", port=8000, reload=True)

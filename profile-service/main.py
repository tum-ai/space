from fastapi import FastAPI
import uvicorn

if __name__ == "__main__":
    uvicorn.run("server.manage:profile_service_app", host="0.0.0.0", port=8000, reload=True)

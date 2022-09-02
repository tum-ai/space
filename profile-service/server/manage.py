from fastapi import FastAPI

profile_service_app = FastAPI(title="ProjectService")


# @profile_service_app.on_event("startup")
#async def startup():
#    await

# @profile_service_app.on_event("shutdown")
# async def shutdown():

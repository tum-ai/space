from typing import List

import motor

from manage import profile_service_app as app
from models.profile import Profile
from models.queries import ProfileQuery
from fastapi import Body
from pydantic import UUID4
from uuid import UUID

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://admin:admin@profilesDB:27017/")

@app.get("/")
async def root():
    return {"message": "Welcome to the TUM.ai Space!"}


@app.get(
    "/profiles",
    response_model=List[Profile]
)
async def get_profiles(query: ProfileQuery = Body(embed=True)):
    pass

# GET profile with query parameters
@app.get("/profile")
async def get_profile(query: ProfileQuery = Body(embed=True)):
    pass

# POST profile
@app.post("/profile")
async def post_profile(profile: Profile):
    pass


# PATCH profile
@app.patch("/profile")
async def patch_profile(profile: Profile):
    pass


# DELETE profile
@app.delete("/profile")
async def delete_profile(profile_id: str):
    pass

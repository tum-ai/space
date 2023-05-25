from fastapi import (
    APIRouter,
)

from database.templates_connector import (
    retrieve_all_template_messages,
)

# All routes will have the prefix "/template"
router = APIRouter()


##########################################################################################
# TODO UPDATE ALL FUNCTIONS BELOW! #######################################################
##########################################################################################


# # Example of a public route
# @router.get(
#     "/", response_description="List all template messages", response_model=Response
# )
# async def list_all_templates():
#     template_messages = await retrieve_all_template_messages()
#     return {
#         "status_code": 200,
#         "response_type": "success",
#         "description": "All template messages retrieved successfully.",
#         "data": template_messages,
#     }


# # Example of a route that requires authentication
# @router.post(
#     "/", response_description="Add a new template message", response_model=Response
# )
# async def add_template(
#     # template: TemplateMessage = Body(...),
# ):
#     # new_template_message = await add_template_message(template)
#     return {
#         "status_code": 200,
#         "response_type": "success",
#         "description": "Template message added successfully by TODO.",
#         # "data": new_template_message,
#     }


# # Example of a protected route
# @router.get(
#     "/{id_}",
#     response_description="Get a single template message",
#     response_model=Response,
# )
# async def show_template(
#     # id_: PydanticObjectId,
# ):
#     # template_message = await retrieve_template_message(id_)
#     # if template_message:
#     #     return {
#     #         "status_code": 200,
#     #         "response_type": "success",
#     #         "description": f"Template message retrieved successfully. "+\
#     #               f"Requested by {session.get_user_id()}. User has"
#     #               f" the following roles: "+\
#     #   	        f"{(await get_roles_for_user(session.get_user_id())).roles}",
#     #         "data": template_message,
#     #     }
#     return {
#         "status_code": 404,
#         "response_type": "error",
#         "description": "TODO adjust. Requested by TODO",
#         "data": None,
#     }

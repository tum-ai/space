##########################################################################################
# TODO UPDATE ALL FUNCTIONS BELOW! #######################################################
##########################################################################################


async def retrieve_all_template_messages():  # -> List[TemplateMessage]:
    # templates = await templates_collection.find_all().to_list()
    # return templates
    pass


async def retrieve_template_message(
    # template_message_id: PydanticObjectId,
):  # -> Union[bool, TemplateMessage]:
    # template_message = await templates_collection.get(template_message_id)
    # if template_message:
    #     return template_message
    # else:
    #     return False
    return False


async def add_template_message(
    # new_template_message: TemplateMessage,
):  # -> TemplateMessage:
    # template_message = await new_template_message.create()
    # return template_message
    pass


async def delete_template_message(
    # template_message_id: PydanticObjectId
) -> bool:
    # template_message = await templates_collection.get(template_message_id)
    # if template_message:
    #     await template_message.delete()
    #     return True
    # else:
    #     return False
    return False


async def update_template_message_data(
    # template_message_id: PydanticObjectId,
    data: dict,
):  # -> Union[bool, TemplateMessage]:
    # update_body = {k: v for k, v in data.items() if v is not None}
    # update_query = {"$set": {field: value for field, value in update_body.items()}}
    # template_message = await templates_collection.get(template_message_id)
    #
    # if template_message:
    #     await template_message.update(update_query)
    #     return template_message
    # else:
    #     return False
    return False

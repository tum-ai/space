# Server initialization file

from supertokens_python import init, InputAppInfo, SupertokensConfig
from supertokens_python.recipe import thirdpartyemailpassword, session

import yaml


class Config:
    """
    This class maps config.yaml to python.
    """

    # Creates config field for each configuration in config.yaml
    def __init__(self, yaml_config_path: str = "config.yaml"):

        self.config_dict = yaml.safe_load(open(yaml_config_path))

        for config in self.config_dict:
            for sub_config, value in self.config_dict[config].items():
                setattr(self, sub_config, value)

    # Will throw an error if the config field is not found
    def get(self, config_field: str):
        return getattr(self, config_field)


CONFIG = Config()


def init_server():
    """
    This function is called when the server starts up.
    It is used to set up the database connection and other configurations.
    """

    init(
        app_info=InputAppInfo(
            # Name of the application. In our case: "TUM.ai Space"
            app_name=CONFIG.get('APP_NAME'),
            # Exposed rest api (our FastAPI app). In our case: https://api.tum-ai.com
            api_domain=CONFIG.get('API_DOMAIN'),
            # Webpage for the auth. In our case: https://auth.tum-ai.com
            website_domain=CONFIG.get('AUTH_WEBSITE_DOMAIN'),
            # The auth api route. In our case: "/auth"
            api_base_path=CONFIG.get('AUTH_API_BASE_PATH'),
            # Path for the auth webpage.
            # Because we have a custom subdomain https://auth.tum-ai.com, we don't need a path
            website_base_path=CONFIG.get('AUTH_WEBSITE_BASE_PATH'),
        ),
        supertokens_config=SupertokensConfig(
            # https://try.supertokens.com is for demo purposes.
            # Replace this with the address of our core instance.
            connection_uri="https://try.supertokens.com",
            # api_key=<API_KEY(if configured)>
        ),
        framework='fastapi',
        recipe_list=[
            session.init(),  # initializes session features
            thirdpartyemailpassword.init(
                # TODO: See next step
            )
        ],
        # use wsgi if we are running using gunicorn
        mode=CONFIG.get("FASTAPI_RUNNING_PROTOCOL")
    )
# Server initialization file

from supertokens_python import init, InputAppInfo, SupertokensConfig
from supertokens_python.recipe.thirdpartyemailpassword import Google, Github
from supertokens_python.recipe import thirdpartyemailpassword, session, dashboard

import yaml


class Config:
    """
    This class maps config.yaml to python.
    """

    # Creates config field for each configuration in config.yaml
    def __init__(self, yaml_config_path: str = "config.yaml"):
        self.yaml_config_path = yaml_config_path
        self.config_dict = yaml.safe_load(open(self.yaml_config_path))

        for config in self.config_dict:
            for sub_config, value in self.config_dict[config].items():
                setattr(self, sub_config, value)

    def get(self, config_field: str):
        """
        This function returns the value of the config field. If the config field is not found, it will throw an error.
        @param config_field: The name of the config field. All the fields are listed in self.config_dict.
        """
        return getattr(self, config_field)


CONFIG = Config()


def init_auth():
    """
    This function is called when the server starts up.
    It is used to set up the database connection and other configurations.
    """

    init(
        app_info=InputAppInfo(
            # Name of the application. In our case: "TUM.ai Space"
            app_name=CONFIG.get("APP_NAME"),
            # Exposed rest api (our FastAPI app). In our case: https://api.tum-ai.com
            api_domain=CONFIG.get("API_DOMAIN"),
            # Webpage for the auth. In our case: https://auth.tum-ai.com
            website_domain=CONFIG.get("AUTH_WEBSITE_DOMAIN"),
            # The auth api route. In our case: "/auth"
            api_base_path=CONFIG.get("AUTH_API_BASE_PATH"),
            # Path for the auth webpage.
            # Because we have a custom subdomain https://auth.tum-ai.com, we don't need a path
            website_base_path=CONFIG.get("AUTH_WEBSITE_BASE_PATH"),
        ),
        supertokens_config=SupertokensConfig(
            # https://try.supertokens.com is for demo purposes.
            # Replace this with the address of our core instance.
            # connection_uri="https://try.supertokens.com",
            connection_uri=CONFIG.get("AUTH_CORE_INSTANCE"),
            # api_key=<API_KEY(if configured)>
        ),
        framework=CONFIG.get("API_FRAMEWORK_NAME"),
        recipe_list=[
            session.init(),  # initializes session features
            thirdpartyemailpassword.init(
                providers=[
                    # We have provided you with development keys which you can use for testing.
                    # IMPORTANT: Please replace them with your own OAuth keys for production use.
                    Google(
                        client_id="1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
                        client_secret="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",
                    ),
                    Github(
                        client_id="467101b197249757c71f",
                        client_secret="e97051221f4b6426e8fe8d51486396703012f5bd",
                    ),
                ]
            ),
            dashboard.init(api_key=CONFIG.get("USERS_DASHBOARD_API_KEY"))
        ],
        # use wsgi if we are running using gunicorn
        mode=CONFIG.get("FASTAPI_RUNNING_PROTOCOL"),
    )

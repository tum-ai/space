from supertokens_python import init, InputAppInfo, SupertokensConfig
from supertokens_python.recipe.thirdpartyemailpassword import Google, Github
from supertokens_python.recipe import thirdpartyemailpassword, session, dashboard, userroles

from main import log
from security.roles import create_admin_role, create_generic_user_role
from config import CONFIG


def init_server_auth():
    """
    This function is called when the server starts up.
    It is used to set up the database connection and other configurations.
    """
    log.debug("Initializing server auth...")

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
            # TODO: add email verification
            # https://supertokens.com/docs/thirdpartyemailpassword/pre-built-ui/enable-email-verification
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
            dashboard.init(api_key=CONFIG.get("USERS_DASHBOARD_API_KEY")),
            userroles.init()
        ],
        # use wsgi if we are running using gunicorn
        mode=CONFIG.get("FASTAPI_RUNNING_PROTOCOL"),
    )


# TODO: set up a proper role creation system
# Create the roles for the users
async def create_roles():
    await create_admin_role()
    await create_generic_user_role()

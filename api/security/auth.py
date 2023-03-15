from typing import Union, Dict, Any, List
from datetime import datetime

from config import CONFIG
from database.profiles_connector import create_profile
from main import log

from profiles.models import Profile, Department, Role, SocialNetwork
from security.roles import create_roles, assign_role_by_user_id
from supertokens_python import InputAppInfo, SupertokensConfig, init
from supertokens_python.recipe.thirdpartyemailpassword.interfaces import (
    APIInterface,
    ThirdPartyAPIOptions,
    EmailPasswordAPIOptions,
    ThirdPartySignInUpPostOkResult,
    EmailPasswordSignInPostOkResult,
    EmailPasswordSignUpPostOkResult,
    ThirdPartySignInUpPostNoEmailGivenByProviderResponse,
    EmailPasswordSignInPostWrongCredentialsError,
    EmailPasswordSignUpPostEmailAlreadyExistsError,
)
from supertokens_python.recipe import (
    dashboard,
    session,
    thirdpartyemailpassword,
    userroles,
)
from supertokens_python.recipe.thirdpartyemailpassword import Github, Google
from supertokens_python.recipe.thirdparty.provider import Provider
from supertokens_python.recipe.emailpassword.types import FormField
from supertokens_python.types import GeneralErrorResponse


def override_sign_up_in_apis(original_implementation: APIInterface):
    original_thirdparty_sign_in_up_post = original_implementation.thirdparty_sign_in_up_post
    original_emailpassword_sign_in_post = original_implementation.emailpassword_sign_in_post
    original_emailpassword_sign_up_post = original_implementation.emailpassword_sign_up_post

    # This function is used to override the default behaviour of the sign-up for the third party identity.
    async def third_party_sign_in_up_post(
            provider: Provider,
            code: str,
            redirect_uri: str,
            client_id: Union[str, None],
            auth_code_response: Union[Dict[str, Any], None],
            api_options: ThirdPartyAPIOptions,
            user_context: Dict[str, Any],
    ):
        # call the default behaviour as show below
        result = await original_thirdparty_sign_in_up_post(
            provider,
            code,
            redirect_uri,
            client_id,
            auth_code_response,
            api_options,
            user_context,
        )

        if isinstance(result, ThirdPartySignInUpPostOkResult):
            if result.created_new_user:
                log.debug(f"New user created with SuperTokens User ID: {result.user.user_id}")
                # Assign DEFAULT role to the new users
                await assign_role_by_user_id(result.user.user_id, "DEFAULT")
                await create_profile(
                    Profile(
                        supertokensId=result.user.user_id,
                        name="Dummy Name",
                        email=result.user.email,
                        description="Dummy Description",
                        degreeLevel="Bachelors",
                        degreeName="ComputerScience",
                        degreeSemester=3,
                        university="TUM",
                        currentJob="Dummy Job",
                        department=Department.DEV,
                        role=Role.MEMBER,
                        previousDepartments=[Department.IND],
                        joinedBatch=datetime(2022, 1, 1),
                        involvedProjects=["TUM.ai Space"],
                        nationality="International",
                        socialNetworks=[SocialNetwork(
                            type=SocialNetwork.SocialNetworkType.OTHER,
                            link="other"
                        )]
                    )
                )

                # TODO: some post sign up logic
            else:
                log.debug(f"User signed in successfully with SuperTokens User ID: {result.user.user_id}")
                # TODO: some post sign in logic

        elif isinstance(result, ThirdPartySignInUpPostNoEmailGivenByProviderResponse):
            log.debug(f"No email given by provider")

        elif isinstance(result, GeneralErrorResponse):
            log.debug(f"General error response")

        return result

    async def email_password_sign_in_post(
            form_fields: List[FormField],
            api_options: EmailPasswordAPIOptions,
            user_context: Dict[str, Any],
    ):
        # call the default behaviour as show below
        result = await original_emailpassword_sign_in_post(
            form_fields, api_options, user_context
        )

        if isinstance(result, EmailPasswordSignInPostOkResult):
            log.debug(f"User signed in successfully with SuperTokens User ID: {result.user.user_id}")
            # TODO: some post sign in logic

        elif isinstance(result, EmailPasswordSignInPostWrongCredentialsError):
            log.debug(f"Wrong credentials")

        elif isinstance(result, GeneralErrorResponse):
            log.debug(f"General error response")

        return result

    async def email_password_sign_up_post(
            form_fields: List[FormField],
            api_options: EmailPasswordAPIOptions,
            user_context: Dict[str, Any],
    ):
        # call the default behaviour as show below
        result = await original_emailpassword_sign_up_post(
            form_fields, api_options, user_context
        )

        if isinstance(result, EmailPasswordSignUpPostOkResult):
            log.debug(f"User signed up successfully with SuperTokens User ID: {result.user.user_id}")
            # Assign DEFAULT role to the new users
            await assign_role_by_user_id(result.user.user_id, "DEFAULT")
            await create_profile(
                Profile(
                    supertokensId=result.user.user_id,
                    name="Dummy Name",
                    email=result.user.email,
                    description="Dummy Description",
                    degreeLevel="Bachelors",
                    degreeName="ComputerScience",
                    degreeSemester=3,
                    university="TUM",
                    currentJob="Dummy Job",
                    department=Department.DEV,
                    role=Role.MEMBER,
                    previousDepartments=[Department.IND],
                    joinedBatch=datetime(2022, 1, 1),
                    involvedProjects=["TUM.ai Space"],
                    nationality="International",
                    socialNetworks=[SocialNetwork(
                        type=SocialNetwork.SocialNetworkType.OTHER,
                        link="other"
                    )]
                )
            )
            # TODO: some post sign up logic
            # TODO: connect analytics
            #

        elif isinstance(result, EmailPasswordSignUpPostEmailAlreadyExistsError):
            log.debug("Email already exists")

        elif isinstance(result, GeneralErrorResponse):
            log.debug(f"General error response")

        return result

    original_implementation.thirdparty_sign_in_up_post = third_party_sign_in_up_post
    original_implementation.emailpassword_sign_in_post = email_password_sign_in_post
    original_implementation.emailpassword_sign_up_post = email_password_sign_up_post
    return original_implementation


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
            session.init(cookie_secure=False),  # initializes session features
            # TODO: add email verification
            # https://supertokens.com/docs/thirdpartyemailpassword/pre-built-ui/enable-email-verification
            thirdpartyemailpassword.init(
                override=thirdpartyemailpassword.InputOverrideConfig(
                    apis=override_sign_up_in_apis
                ),
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
                ],
            ),
            dashboard.init(api_key=CONFIG.get("USERS_DASHBOARD_API_KEY")),
            userroles.init(),
        ],
        # use wsgi if we are running using gunicorn
        mode=CONFIG.get("FASTAPI_RUNNING_PROTOCOL"),
    )


# TODO: set up a proper role creation system via the dashboard
# Create the roles for the users
async def create_auth_roles():
    """
    This function is called when the server starts up. It is used to set up roles within the auth system.
    """
    log.info("Creating auth roles...")
    await create_roles()

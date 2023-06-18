EMAIL_TEMPLATE_PASSWORD_RESET = """
Hello ${NAME},

We have received a request to reset your password for your TUM.ai Space 
account. To proceed with the password reset process, please follow 
the instructions below:

Click on the following link to access the password reset page:
${PASSWORD_RESET_LINK}

Once you click on the link, you will be redirected to a secure page where you can 
create a new password.

Please note the following important points:

This password reset link is valid for [time duration, e.g., 24 hours]. After this 
period, you will need to request another password reset.

If you did not initiate this password reset request, please ignore this email and 
ensure the security of your account by not sharing your credentials with anyone.

If you are having trouble accessing the password reset page, please copy and paste the 
provided link into your web browser's address bar.

If you have any further questions or require assistance, please do not hesitate to 
contact our support team at [Support Email/Phone Number]. We are here to help.

Thank you for using [Website/Platform/App].

Best regards,

TUM.ai Space TEAM
"""
"""
This is a template for the password reset email. 

It is used to generate the body of the email. We will alse send out these password 
reset emails when new members are invited into TUM.ai Space.
"""


def generate_password_reset_body(member_name: str, password_reset_link: str) -> str:
    return EMAIL_TEMPLATE_PASSWORD_RESET.replace("${NAME}", member_name).replace(
        "${PASSWORD_RESET_LINK}", password_reset_link
    )

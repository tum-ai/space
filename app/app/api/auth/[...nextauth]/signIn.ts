import { User } from "@prisma/client";
import { Session } from "next-auth";

/**
 *  Checks if the user already exists
 *
 * @param email - The email associated with the user that is trying to sign in
 *
 * @returns Returns a promise of true or throws an error if there was an error retrieving the user
 *
 * @see {@link https://www.prisma.io/docs}
 */
async function checkUserExistence(email: string): Promise<boolean> {
  const potentialUser = await prisma.user
    .findFirst({
      where: {
        email: email,
      },
    })
    .catch((error) => {
      console.log("Failed to retrieve user with that email:\n" + error);
    });

  return potentialUser !== null;
}

/**
 *  Persists a new user to the database
 *
 * @param profile - The modified oAuth response object containing all information to persist a new user
 * @param prisma - The prisma client that is used to persist everything (and abide by ACID principles)
 *
 * @returns Returns a promise of type user when the user has been successfully persisted
 *
 * @see {@link https://www.prisma.io/docs} {@link https://www.databricks.com/glossary/acid-transactions}
 */
async function persistUser(profile, prisma): Promise<User> {
  const {
    email,
    given_name: firstName,
    family_name: lastName,
    picture: image,
    date_email_verified: emailVerifiedTimestamp,
  } = profile;

  return await prisma.user
    .create({
      data: {
        email,
        firstName,
        lastName,
        image,
        emailVerified: new Date(emailVerifiedTimestamp * 1000),
        userRoles: { connect: [{ name: "member" }] },
      },
    })
    .catch((error) => {
      throw new Error("Failed to persist user:\n", error);
    });
}

/**
 *  Inserts metadata, @account to account mdoel with reference to the already persisted user, @persistedUser to the database - this is required for the oAuth flow
 *
 * @param account - Metadata about the account (response from slack oAuth)
 * @param persistedUser - The user that the account will be linked to
 * @param prisma - The prisma client that is used to persist everything (and abide by ACID principles)
 *
 * @returns Returns a promise of true if the account was successfully persisted and linked to the persistedUser
 *
 * @see {@link https://www.prisma.io/docs} {@link https://www.databricks.com/glossary/acid-transactions}
 */
async function persistAccount(
  account,
  persistedUser,
  prisma,
): Promise<boolean> {
  const {
    id_token: idToken,
    type,
    provider,
    providerAccountId,
    ok,
    state,
    access_token: accessToken,
    token_type: tokenType,
  } = account;

  await prisma.account
    .create({
      data: {
        userId: persistedUser.id,
        idToken,
        type,
        provider,
        providerAccountId,
        ok,
        state,
        accessToken,
        tokenType,
      },
    })
    .catch((error) => {
      console.log("Failed to persist account:\n", error);
      return false;
    });

  return true;
}

/**
 *  Handles sign in for providers by persisting the user and (for oAuth, the account metadata) before authorizing access to space
 *
 * @param profile - The returned response of the user's Slack profile
 * @param account - Metadata about the account
 *
 * @returns Returns a promise of true if the sign in was successful and false if otherwise. Errors are handled in each function locally for easier debugging
 *
 * @see {@link https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/providers/slack.ts}
 */
export async function signIn({ profile, account }): Promise<boolean> {
  return await prisma.$transaction(async (prisma) => {
    const isUserPersisted = await checkUserExistence(profile.email);

    if (!isUserPersisted) {
      const persistedUser = await persistUser(profile, prisma);
      return await persistAccount(account, persistedUser, prisma);
    }

    return true;
  });
}

/**
 *  Modifies the JWT by adding user roles, first/last name, id and images before sending the JWT to the client
 *
 * @param id - The id of the user for which roles should be found
 *
 * @returns Promise of an array of the role names a user possesses
 *
 * @see {@link https://www.prisma.io/docs}
 */
async function findRoles(id: string): Promise<string[]> {
  const rolesOfUser = await prisma.user
    .findUnique({
      where: {
        id: id,
      },
      select: {
        userRoles: { select: { name: true } },
      },
    })
    .catch((error) => {
      throw new Error("Failed to persist account:\n", error);
    });

  return rolesOfUser.userRoles.map((role) => role.name);
}

/**
 *  Modifies the JWT by adding user roles, first/last name, id and images before sending the JWT to the client
 *
 * @param token - The JWT that is being returned to the client
 * @param user - The authenticated user object that is returned by the provider and used to sign int the JWT
 *
 *
 * @returns Returns the JWT object for storing encrypted user and session data to authorize requests
 * @see {@link https://next-auth.js.org/configuration/callbacks}
 */
export async function jwt({ token, user }): Promise<User> {
  delete token.name;

  if (user) {
    try {
      const roles = await findRoles(user.id);
      const { firstName, lastName, id, image } = await user;
      token.user = { firstName, lastName, id, image, roles };
    } catch (error) {
      console.log(error);
    }
  }

  return token;
}

/**
 *  Returns the session object for storing if the user is authenticated and storing frequently accessed data
 *
 * @param session - The session that is being returned to the client
 * @param token - The JWT that contains the user's authentication information (user object, see exported JWT function)
 *
 *
 * @returns the session in the form of a promise containing user data (first/last name, image, id, roles) and expiration
 * @see {@link https://next-auth.js.org/configuration/callbacks}
 */
export async function createNewSession({ session, token }): Promise<Session> {
  try {
    const user = await token.user;
    session.user = user;
  } catch (error) {
    console.log(
      "Unable to find user associated with this session. See error:\n" + error,
    );
  }
  return session;
}

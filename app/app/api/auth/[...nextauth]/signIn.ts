import { Account, User, UserRole } from "@prisma/client"
import { Session } from "next-auth"

async function checkUserExistence(email: string): Promise<User> {
    return await prisma.user.findFirst({
        where: {
          email: email
        }
    })
    .catch((error) => {
        throw new Error("Failed to retrieve user with id: \n", error)
    })
}

async function persistUser(profile, prisma): Promise<User> {
    const {email,given_name: firstName,family_name: lastName,picture: image, date_email_verified: emailVerifiedTimestamp} = profile
    
    return await prisma.user.create({
        data: {
        email,
        firstName,
        lastName,
        image,
        emailVerified: new Date(emailVerifiedTimestamp * 1000),
        userRoles: { connect: [{ name: "member" }] }
    }
    })
    .catch((error) => {
        throw new Error("Failed to persist user: \n", error)
    })
}

async function persistAccount(account, persistedUser, prisma): Promise<Account> {
    const {id_token:idToken, type, provider, providerAccountId, ok, state, access_token:accessToken, token_type:tokenType} = account
      
    return await prisma.account.create({
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
      }
    })
    .catch((error) => {
        throw new Error("Failed to persist account: \n", error)
    })
}

export async function signIn({ profile, account }): Promise<boolean> {
    return await prisma.$transaction(async (prisma) => {
        const isUserPersisted = await checkUserExistence(profile.email)

        if (!isUserPersisted) {
            try {
                const persistedUser = await persistUser(profile, prisma)
                await persistAccount(account, persistedUser, prisma)
                return true
            } catch (error) {
                console.log(error)
                return false
            }
        }

        return true
    })
}



async function findRoles(id: string): Promise<string[]> {
    const rolesOfUser = await prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          userRoles: { select: {name: true } }
        }
    })
    .catch((error) => {
        throw new Error("Failed to persist account: \n", error)
    })
    
    return rolesOfUser.userRoles.map(role => role.name);
}

/**
 * 
 * @param param0 
 * 
 * 
 * 
 * 
 * @returns 
 */

export async function jwt({token, user}): Promise<User>{
    delete token.name

    if (user) {
        try {
            const roles = await findRoles(user.id)
            const { firstName, lastName, id, image } = await user
            token.user = { firstName, lastName, id, image, roles }
        }
        catch(error) {
            console.log(error)
        }
    }
    
    return token
}

export async function createNewSession({session, token}): Promise<Session> {
    const user = await token.user
    session.user = user
    return session
}
import Router from "next/router";
import SessionReact from "supertokens-auth-react/recipe/session";
import ThirdPartyEmailPasswordReact from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { appInfo } from "./appInfo";

export let frontendConfig = () => {
    return {
        appInfo,
        // recipeList contains all the modules that you want to
        // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
        recipeList: [
            ThirdPartyEmailPasswordReact.init({
                signInAndUpFeature: {
                    providers: [
                        ThirdPartyEmailPasswordReact.Google.init(),
                        ThirdPartyEmailPasswordReact.Github.init()
                    ],
                },
                getRedirectionURL: async (context) => {                    
                    if (context.action === "SUCCESS") {
                        if (context.redirectToPath) {
                            // we are navigating back to where the user was before they authenticated
                            return context.redirectToPath;
                        }
                        return "http://space.tum-ai-dev.com:15950";
                    }
                    return undefined;
                }
            }),
            SessionReact.init(),
        ],
        // this is so that the SDK uses the next router for navigation
        windowHandler: (oI) => {
            return {
                ...oI,
                location: {
                    ...oI.location,
                    setHref: (href) => {
                        Router.push(href);
                    },
                },
            };
        },
    };
};

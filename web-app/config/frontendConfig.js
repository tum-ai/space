import Router from 'next/router';
import { default as SessionReact } from 'supertokens-auth-react/recipe/session';
import ThirdPartyEmailPasswordReact from "supertokens-auth-react/recipe/thirdpartyemailpassword";

import { appInfo } from './appInfo';

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
                        ThirdPartyEmailPasswordReact.Github.init(),
                    ],
                },
                getRedirectionURL: async (context) => {
                    console.log(context);
                    
                    if (context.action === "SUCCESS") {
                        if (context.redirectToPath !== undefined) {
                            // we are navigating back to where the user was before they authenticated
                            return context.redirectToPath.substring(1);
                        }
                        return process.env.NEXT_PUBLIC_WEBSITE_URL;
                    }
                    return undefined;
                }
            }),
            SessionReact.init({
                // sessionTokenFrontendDomain: ".tum-ai-dev.com:15950"
                sessionTokenFrontendDomain: process.env.NEXT_PUBLIC_SUBDOMAINS
            }),
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
import Router from 'next/router';
import { default as SessionReact } from 'supertokens-auth-react/recipe/session';
import { appInfo } from './appInfo';

export let frontendConfig = () => {
	return {
		appInfo,
		// recipeList contains all the modules that you want to
		// use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
		recipeList: [SessionReact.init()],
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

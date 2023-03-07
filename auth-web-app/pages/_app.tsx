import { useEffect } from "react";
import SuperTokensReact, { SuperTokensWrapper } from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import * as SuperTokensConfig from "../config/frontendConfig";
import "../styles/globals.css";

if (typeof window !== "undefined") {
    SuperTokensReact.init(SuperTokensConfig.frontendConfig());
}

function MyApp({ Component, pageProps }): JSX.Element {
    useEffect(() => {
        async function doRefresh() {
            if (pageProps.fromSupertokens === "needs-refresh") {
                if (await Session.attemptRefreshingSession()) {
                    location.reload();
                } else {
                    // user has been logged out
                    SuperTokensReact.redirectToAuth();
                }
            }
        }
        doRefresh();
    }, [pageProps.fromSupertokens]);
    if (pageProps.fromSupertokens === "needs-refresh") {
        return null;
    }

    return (
        <SuperTokensWrapper>
            <Component {...pageProps} />
        </SuperTokensWrapper>
    );
}

export default MyApp;

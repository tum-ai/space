import SuperTokensReact, { SuperTokensWrapper } from 'supertokens-auth-react';
import * as SuperTokensConfig from '../config/frontendConfig';
import { RootStoreProvider } from '../providers/RootStoreProvider';
import '../styles/globals.css';

if (typeof window !== 'undefined') {
	SuperTokensReact.init(SuperTokensConfig.frontendConfig());
}
function App({ Component, pageProps }) {
	return (
		<SuperTokensWrapper>
			<RootStoreProvider hydrationData={pageProps.hydrationData}>
				<Component {...pageProps} />
			</RootStoreProvider>
		</SuperTokensWrapper>
	);
}

export default App;

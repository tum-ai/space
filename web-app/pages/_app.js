import { useEffect } from 'react';
import SuperTokensReact, { SuperTokensWrapper } from 'supertokens-auth-react';
import * as SuperTokensConfig from '../config/frontendConfig';
import { RootStoreProvider } from '../providers/RootStoreProvider';
import '../styles/globals.css';

if (typeof window !== 'undefined') {
	SuperTokensReact.init(SuperTokensConfig.frontendConfig());
}
function App({ Component, pageProps }) {
	useEffect(() => {
		document.documentElement.style.setProperty(
			'--vh',
			window.innerHeight * 0.01 + 'px'
		);
	}, []);
	return (
		<SuperTokensWrapper>
			<RootStoreProvider hydrationData={pageProps.hydrationData}>
				<Component {...pageProps} />
			</RootStoreProvider>
		</SuperTokensWrapper>
	);
}

export default App;

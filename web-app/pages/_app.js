import { RootStoreProvider } from '../providers/RootStoreProvider';
import '../styles/globals.css';

function App({ Component, pageProps }) {
	return (
		<RootStoreProvider hydrationData={pageProps.hydrationData}>
			<Component {...pageProps} />
		</RootStoreProvider>
	);
}

export default App;

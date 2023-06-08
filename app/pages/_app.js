import { useEffect } from 'react';
import { AuthContextProvider } from '../providers/AuthContextProvider';
import { RootStoreProvider } from '../providers/RootStoreProvider';
import '../styles/globals.css';
import NavBar from '/components/NavBar/index';

function App({ Component, pageProps }) {
	useEffect(() => {
		document.documentElement.style.setProperty(
			'--vh',
			window.innerHeight * 0.01 + 'px'
		);
	}, []);
	return (
		<AuthContextProvider>
			<RootStoreProvider hydrationData={pageProps.hydrationData}>
				<NavBar />
				<Component {...pageProps} />
			</RootStoreProvider>
		</AuthContextProvider>
	);
}

export default App;

import { useEffect } from 'react';
import { RootStoreProvider } from '../providers/RootStoreProvider';
import { AuthContext } from '../context/AuthContext';
import '../styles/globals.css';


function App({ Component, pageProps }) {
	useEffect(() => {
		document.documentElement.style.setProperty(
			'--vh',
			window.innerHeight * 0.01 + 'px'
		);
	}, []);
	return (
		// <AuthContext>
			<RootStoreProvider hydrationData={pageProps.hydrationData}>
				<Component {...pageProps} />
			</RootStoreProvider>
		// </AuthContext>
	);
}

export default App;

import { useEffect } from 'react';
import { RootStoreProvider } from '../providers/RootStoreProvider';
import { AuthContextProvider } from '../context/AuthContext';
import { useRouter } from 'next/router'
import '../styles/globals.css';

function App({ Component, pageProps }) {
	const router = useRouter()
	useEffect(() => {
		document.documentElement.style.setProperty(
			'--vh',
			window.innerHeight * 0.01 + 'px'
		);
	}, []);
	return (
		<AuthContextProvider>
			<RootStoreProvider hydrationData={pageProps.hydrationData}>

				<Component {...pageProps} />

			</RootStoreProvider>
		</AuthContextProvider>
	);
}

export default App;

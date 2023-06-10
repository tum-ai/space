import axios from 'axios';
import { useEffect } from 'react';
import GlobalModal from '../components/globalModal';
import { AuthContextProvider } from '../providers/AuthContextProvider';
import { RootStoreProvider } from '../providers/RootStoreProvider';
import '../styles/globals.css';
import NavBar from '/components/NavBar/index';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

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
				<GlobalModal />
			</RootStoreProvider>
		</AuthContextProvider>
	);
}

export default App;

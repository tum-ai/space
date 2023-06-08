import axios from 'axios';
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	console.log(user);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				console.log(user);
				console.log(user.accessToken);
				axios.defaults.headers = {
					authorization: `bearer ${user.accessToken}`,
				};
				setUser({
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
				});
			} else {
				setUser(null);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const signup = (email, password) => {
		return createUserWithEmailAndPassword(auth, email, password);
	};

	const login = async (email, password) => {
		return signInWithEmailAndPassword(auth, email, password);
	};

	const getUserAuthToken = async () => {
		return await auth.currentUser?.getIdToken();
	};

	const logout = async () => {
		setUser(null);
		await signOut(auth);
	};

	return (
		<AuthContext.Provider value={{ user, loading, login, signup, logout }}>
			{loading ? null : children}
		</AuthContext.Provider>
	);
};

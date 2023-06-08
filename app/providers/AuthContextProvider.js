import axios from 'axios';
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { ProfileModel } from '../models/profile';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				axios.defaults.headers = {
					authorization: `bearer ${user.accessToken}`,
				};
				const profile = await ProfileModel.fetchProfile('me');
				setUser({
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
					profile: { ...profile },
				});
			} else {
				setUser(null);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);
	console.log(user);

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

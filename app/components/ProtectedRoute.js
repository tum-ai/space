import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuth } from '../providers/AuthContextProvider';

const ProtectedRoute = ({ roles, children }) => {
	const { user, loading, hasRoles } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			router.push('/auth');
		}
	}, [user]);

	if (loading) {
		return <div>loading ...</div>;
	}

	if (hasRoles(user, roles)) {
		return <>{children}</>;
	}

	return <div>404 ...</div>;
};

export default ProtectedRoute;

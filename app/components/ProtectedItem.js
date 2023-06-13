import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuth } from '../providers/AuthContextProvider';

function ProtectedItem({ roles, redirectToAuth, showNotFound, children }) {
	const { user, loading, hasRoles } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!user && redirectToAuth && !showNotFound) {
			router.push('/notfound');
		}
	}, [user]);

	if (loading) {
		return <div>loading ...</div>;
	}

	if (hasRoles(user, roles)) {
		return <>{children}</>;
	}

	if (showNotFound) {
		return <div>not found</div>;
	}

	return null;
}

export default ProtectedItem;

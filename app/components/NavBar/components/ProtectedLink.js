import React from 'react';
import { useAuth } from '/providers/AuthContextProvider';

const ProtectedLink = ({ roles, children }) => {
	const { user, hasRoles } = useAuth();

	if (hasRoles(user, roles)) {
		return <>{children}</>;
	}

	return null;
};

export default ProtectedLink;

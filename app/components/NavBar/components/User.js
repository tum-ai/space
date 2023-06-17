import Link from 'next/link';
import { useAuth } from '../../../providers/AuthContextProvider';

function User() {
	const { user, logout } = useAuth();
	return (
		<div className='flex space-x-4'>
			{user ? (
				<>
					<Link
						href='/me'
						className={
							' hover:text-black dark:hover:text-white hover:underline bg-gray-200 dark:bg-gray-700 p-2 rounded-lg'
						}
					>
						{user.profile.first_name}
					</Link>
					<button onClick={logout}>Logout</button>
				</>
			) : (
				<>
					<Link
						href={'/auth'}
						className='bg-white dark:bg-gray-700 p-2 rounded'
					>
						Login
					</Link>
				</>
			)}
		</div>
	);
}

export default User;

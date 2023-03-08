import Link from 'next/Link';
import { useRouter } from 'next/router';
import SuperTokensReact from 'supertokens-auth-react';
import SessionReact, {
	useSessionContext,
} from 'supertokens-auth-react/recipe/session';

function NavBar() {
	const session = useSessionContext();
	const router = useRouter();
	console.log(router);
	async function logoutClicked() {
		await SessionReact.signOut();
		SuperTokensReact.redirectToAuth();
	}
	return (
		<div className='w-full bg-gray-100 p-6 flex items-center dark:bg-black'>
			<div className=''>Space</div>
			<div className='h-auto mx-auto flex space-x-8'>
				<Link
					href={'/'}
					className={
						'text-gray-500 hover:text-black dark:hover:text-white hover:underline ' +
						(router.pathname == '/' && 'underline font-bold')
					}
				>
					{/* <Icon
						name={'FaHome'}
						className='bg-gray-300 p-2 rounded-full text-white hover:scale-110 transition hover:bg-purple-400 text-xl'
					/> */}
					Home
				</Link>
				<Link
					href={'/members'}
					className={
						'text-gray-500 hover:text-black dark:hover:text-white hover:underline ' +
						(router.pathname.includes('/members') &&
							'underline font-bold')
					}
				>
					{/* <Icon
						name={'FaUsers'}
						className='bg-gray-300 p-2 rounded-full text-white hover:scale-105 transition hover:bg-purple-400 text-xl'
					/> */}
					Members
				</Link>
				{/* <Link
					href='/me'
					className='text-gray-500 hover:text-black dark:hover:text-white hover:underline'
				>
					My profile
				</Link> */}
			</div>
			{session.userId ? (
				<button onClick={logoutClicked}>Sign out</button>
			) : (
				<a
					href='http://auth.tum-ai-dev.com:15950'
					className='bg-white dark:bg-gray-700 p-2 rounded'
					onClick={logoutClicked}
				>
					Sign in
				</a>
			)}
		</div>
	);
}
export default NavBar;

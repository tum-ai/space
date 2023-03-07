import Link from 'next/Link';
import SuperTokensReact from 'supertokens-auth-react';
import SessionReact, {
	useSessionContext,
} from 'supertokens-auth-react/recipe/session';

function NavBar() {
	const session = useSessionContext();
	async function logoutClicked() {
		await SessionReact.signOut();
		SuperTokensReact.redirectToAuth();
	}
	return (
		<div className='w-full bg-white p-6 flex drop-shadow'>
			<div className='h-auto mx-auto flex space-x-8'>
				<Link
					href={'/'}
					className='text-gray-600 hover:text-black hover:underline'
				>
					{/* <Icon
						name={'FaHome'}
						className='bg-gray-300 p-2 rounded-full text-white hover:scale-110 transition hover:bg-purple-400 text-xl'
					/> */}
					Home
				</Link>
				<Link
					href={'/members'}
					className='text-gray-600 hover:text-black hover:underline'
				>
					{/* <Icon
						name={'FaUsers'}
						className='bg-gray-300 p-2 rounded-full text-white hover:scale-105 transition hover:bg-purple-400 text-xl'
					/> */}
					Members
				</Link>
				<Link
					href='/me'
					className='text-gray-600 hover:text-black hover:underline'
				>
					{/* <Icon
						name={'FaUsers'}
						className='bg-gray-300 p-2 rounded-full text-white hover:scale-105 transition hover:bg-purple-400 text-xl'
					/> */}
					My profile
				</Link>
				<button onClick={logoutClicked}>sign out</button>
			</div>
		</div>
	);
}
export default NavBar;

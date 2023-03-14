import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
	signOut,
	useSessionContext,
} from 'supertokens-auth-react/recipe/session';

function NavBar() {
	const session = useSessionContext();
	const router = useRouter();
	function logoutClicked() {
		signOut()
			.then(() => {
				router.reload();
			})
			.catch(() => {
				console.log('Could not sign out.');
			});
	}
	return (
		<div className='w-full bg-gray-100 p-4 lg:p-6 flex items-center dark:bg-black sticky top-0 z-20'>
			<div>
				<Link href={'/'}>
					<Image
						className='dark:block hidden'
						priority
						src='/logo/Group 6281-2.svg'
						height={48}
						width={48}
						alt='Follow us on Twitter'
					/>
					<Image
						className='dark:hidden visible'
						priority
						src='/logo/Group 6281-1.svg'
						height={48}
						width={48}
						alt='Follow us on Twitter'
					/>
				</Link>
			</div>
			<div className='h-auto mx-auto flex space-x-4 lg:space-x-8'>
				<Link
					href={'/'}
					className={
						'text-gray-500 hover:text-black dark:hover:text-white hover:underline ' +
						(router.asPath == '/' && 'underline font-bold')
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
						(router.asPath?.includes('/members') &&
							!router.asPath?.includes('/members/me') &&
							'underline font-bold')
					}
				>
					{/* <Icon
						name={'FaUsers'}
						className='bg-gray-300 p-2 rounded-full text-white hover:scale-105 transition hover:bg-purple-400 text-xl'
					/> */}
					Members
				</Link>
				{session.doesSessionExist && (
					<Link
						href='/members/me'
						className={
							'text-gray-500 hover:text-black dark:hover:text-white hover:underline ' +
							(router.asPath === '/members/me' &&
								'underline font-bold')
						}
					>
						My profile
					</Link>
				)}
			</div>
			{session.doesSessionExist ? (
				<button onClick={logoutClicked}>Logout</button>
			) : (
				<a
					href={
						process.env.NEXT_PUBLIC_AUTH_URL +
						'auth?redirectToPath=/' +
						process.env.NEXT_PUBLIC_WEBSITE_URL +
						router.asPath.substring(1)
					}
					className='bg-white dark:bg-gray-700 p-2 rounded'
				>
					Login
				</a>
			)}
		</div>
	);
}
export default NavBar;

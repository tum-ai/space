import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Icon from '/components/Icon';
import { useAuth } from '../context/AuthContext';

function NavBar() {
	return (
		<>
			<NavBarDesktop />
			<NavBarMobile />
		</>
	);
}

function NavBarDesktop() {
	const router = useRouter();
	const { user } = useAuth();

	console.log(user);

	return (
		<div className='lg:flex hidden w-full bg-gray-100 p-4 lg:p-6 flex space-x-6 items-center dark:bg-black sticky top-0 z-20'>
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
			<div className='flex space-x-4 justify-between items-center w-full'>
				<div className='h-auto flex space-x-4 lg:space-x-8'>
					<Link
						href={'/'}
						className={
							'text-gray-500 hover:text-black dark:hover:text-white hover:underline ' +
							(router.asPath == '/' && 'font-bold')
						}
					>
						Home
					</Link>
					<Link
						href={'/members'}
						className={
							'text-gray-500 hover:text-black dark:hover:text-white hover:underline ' +
							(router.asPath?.includes('/members') &&
								!router.asPath?.includes('/members/me') &&
								'font-bold')
						}
					>
						Team
					</Link>
				</div>
				{/* <div className='flex space-x-4'>
					{session.doesSessionExist ? (
						<>
							<Link
								href='/members/me'
								className={
									' hover:text-black dark:hover:text-white hover:underline bg-gray-200 dark:bg-gray-700 p-2 rounded-lg ' +
									(router.asPath === '/members/me' &&
										'font-bold')
								}
							>
								My profile
							</Link>
							<button onClick={logoutClicked}>Logout</button>
						</>
					) : (
						<>
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
						</>
					)}
				</div> */
				// TODO display name when logged in
					<div>
						<a
							href={
								"/auth"
							}
							className='bg-white dark:bg-gray-700 p-2 rounded'
						>
							Log in or sign up
						</a>
					</div>}
			</div>
		</div>
	);
}

function NavBarMobile() {
	// const session = useSessionContext();
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
	const [active, setActive] = useState(false);
	return (
		<div className='lg:hidden flex w-full bg-gray-100 p-4 lg:p-6 flex-col items-center dark:bg-black sticky top-0 z-20'>
			<div className='flex justify-between w-full'>
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
				<button
					onClick={() => {
						setActive(!active);
					}}
				>
					<Icon
						name={'FaBars'}
						className='rounded hover:scale-105 bg-gray-100 dark:bg-black'
					/>
				</button>
			</div>
			{active && (
				<div className='slide-down absolute z-0 pt-20 bg-gradient-to-b from-gray-100 to-white dark:from-black dark:to-gray-900 p-4 rounded-b-lg flex flex-col space-y-4 justify-between items-center w-full shadow-lg'>
					<Link
						href={'/'}
						className={
							'text-gray-500 hover:text-black dark:hover:text-white hover:underline ' +
							(router.asPath == '/' && 'font-bold')
						}
					>
						Home
					</Link>
					<Link
						href={'/members'}
						className={
							'text-gray-500 hover:text-black dark:hover:text-white hover:underline ' +
							(router.asPath?.includes('/members') &&
								!router.asPath?.includes('/members/me') &&
								'font-bold')
						}
					>
						Team
					</Link>
					<div className='flex space-x-4'>
						{/* {session.doesSessionExist ? (
							<>
								<Link
									href='/members/me'
									className={
										' hover:text-black dark:hover:text-white hover:underline bg-gray-200 dark:bg-gray-700 p-2 rounded-lg ' +
										(router.asPath === '/members/me' &&
											'font-bold')
									}
								>
									My profile
								</Link>
								<button onClick={logoutClicked}>Logout</button>
							</>
						) : (
							<>
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
							</>
						)} */}
					</div>
				</div>
			)}
		</div>
	);
}

export default NavBar;

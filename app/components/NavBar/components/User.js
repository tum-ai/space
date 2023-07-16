import { observer } from 'mobx-react';
import Link from 'next/link';
import Icon from '/components/Icon';
import { useStores } from '/providers/StoreProvider';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';

function User() {
	const { uiModel, meModel } = useStores();
	const user = meModel.user;

	return (
		<div
			onClick={() => {
				uiModel.setNavBarActive(false);
			}}
			className='flex space-x-4'
		>
			{user ? (
				<>
					<Link
						href='/me'
						className={
							'flex items-center space-x-4 px-4 rounded-full hover:text-black dark:hover:text-white bg-gray-200 dark:bg-gray-700 p-2'
						}
					>
						{user.profile.profile_picture ? (
							<Image
							className='rounded-full w-8 h-8 object-cover'
							src={user.profile.profile_picture}
							alt=''
						  />
						) : (
							<div className='rounded-full w-8 h-8 bg-gray-300 dark:bg-gray-800 flex text-center drop-shadow-lg'>
								<FaUser
									name={'FaUser'}
									className='m-auto text-xl text-white'
								/>
							</div>
						)}
						<div>
							{user.profile.first_name} {user.profile.last_name}
						</div>
					</Link>
					<button
						onClick={() => {
							meModel.logout();
						}}
					>
						Logout
					</button>
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

export default observer(User);

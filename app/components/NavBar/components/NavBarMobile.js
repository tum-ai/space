import { useState } from 'react';
import Links from './Links';
import Logo from './Logo';
import User from './User';
import Icon from '/components/Icon';

function NavBarMobile() {
	const [active, setActive] = useState(false);
	return (
		<div className='lg:hidden flex w-full bg-gray-100 p-4 lg:p-6 flex-col items-center dark:bg-black sticky top-0 z-20'>
			<div className='flex justify-between w-full'>
				<Logo />
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
					<Links />
					<div className='flex space-x-4'>
						<User />
					</div>
				</div>
			)}
		</div>
	);
}

export default NavBarMobile;

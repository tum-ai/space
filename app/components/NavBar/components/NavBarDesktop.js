import Links from './Links';
import Logo from './Logo';
import User from './User';

function NavBarDesktop() {
	return (
		<div className='lg:flex hidden w-full bg-white p-4 lg:p-6 space-x-6 items-center dark:bg-black sticky top-0 z-20 shadow-md bg-gradient-to-t dark:from-black dark:to-gray-900'>
			<Logo />
			<div className='flex space-x-4 justify-between items-center w-full'>
				<div className='h-auto flex space-x-4 lg:space-x-8'>
					<Links />
				</div>
				<User />
			</div>
		</div>
	);
}

export default NavBarDesktop;

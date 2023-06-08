import Links from './Links';
import Logo from './Logo';
import User from './User';

function NavBarDesktop() {
	return (
		<div className='lg:flex hidden w-full bg-gray-100 p-4 lg:p-6 flex space-x-6 items-center dark:bg-black sticky top-0 z-20'>
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
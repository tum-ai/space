import { observer } from 'mobx-react';
import Links from './Links';
import Logo from './Logo';
import User from './User';
import Icon from '/components/Icon';
import { useStores } from '/providers/StoreProvider';

function NavBarMobile() {
	const { uiModel } = useStores();
	return (
		<div className='lg:hidden flex w-full bg-white shadow-md p-4 lg:p-6 flex-col items-center dark:bg-black sticky top-0 z-20'>
			<div className='flex justify-between w-full'>
				<Logo />
				<button
					onClick={() => {
						uiModel.setNavBarActive(!uiModel.navBarActive);
					}}
				>
					<Icon
						name={'FaBars'}
						className='rounded hover:scale-105 bg-gray-100 dark:bg-black'
					/>
				</button>
			</div>
			{uiModel.navBarActive && (
				<div className='slide-down absolute z-0 pt-20 bg-gradient-to-b bg-white dark:from-black dark:to-gray-900 p-4 rounded-b-lg flex flex-col space-y-4 justify-between items-center w-full shadow-lg'>
					<Links />
					<div className='flex space-x-4'>
						<User />
					</div>
				</div>
			)}
		</div>
	);
}

export default observer(NavBarMobile);

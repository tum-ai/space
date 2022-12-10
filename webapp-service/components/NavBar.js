import Icon from './Icon';

function NavBar() {
	return (
		<div className='w-full bg-white p-4 flex drop-shadow-lg'>
			<div className='h-auto mx-auto flex space-x-4'>
				<a href='/'>
					<Icon
						name={'FaHome'}
						className='bg-purple-500 p-2 rounded-full text-white hover:scale-105 hover:bg-purple-600'
					/>
				</a>
				<a href='/members'>
					<Icon
						name={'FaUsers'}
						className='bg-purple-500 p-2 rounded-full text-white hover:scale-105 hover:bg-purple-600'
					/>
				</a>
			</div>
		</div>
	);
}
export default NavBar;

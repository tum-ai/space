import Icon from './Icon';

function NavBar() {
	return (
		<div className='w-full bg-white p-6 flex drop-shadow'>
			<div className='h-auto mx-auto flex space-x-8'>
				<a href='/'>
					<Icon
						name={'FaHome'}
						className='bg-gray-300 p-2 rounded-full text-white hover:scale-110 transition hover:bg-purple-400 text-xl'
					/>
				</a>
				<a href='/members'>
					<Icon
						name={'FaUsers'}
						className='bg-gray-300 p-2 rounded-full text-white hover:scale-105 transition hover:bg-purple-400 text-xl'
					/>
				</a>
			</div>
		</div>
	);
}
export default NavBar;

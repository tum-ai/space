import NavBar from 'components/NavBar';

function Page({ className, children }) {
	return (
		<div className='h-screen w-screen overflow-hidden'>
			<NavBar />
			<div className='h-full w-full p-12 overflow-y-auto bg-gray-100 dark:bg-black'>
				{children}
			</div>
		</div>
	);
}
export default Page;

import NavBar from 'components/NavBar';

function Page({ className, children }) {
	return (
		<div className='h-screen w-screen overflow-hidden'>
			<NavBar />
			<div className='h-full w-full p-6 overflow-y-auto bg-white dark:bg-gray-800'>
				<div className={className}>{children}</div>
			</div>
		</div>
	);
}
export default Page;

import NavBar from 'components/NavBar';

function Page({ className, children }) {
	return (
		<div className='h-screen w-screen overflow-y-auto bg-gray-100 dark:bg-black'>
			<NavBar />
			<div className='lg:p-12 p-4'>{children}</div>
		</div>
	);
}
export default Page;

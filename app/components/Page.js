function Page({ className, children }) {
	return (
		<div className='h-screen w-screen overflow-y-auto bg-gray-100 dark:bg-black'>
			<div className='lg:p-12 p-4 pt-0 lg:pt-4'>{children}</div>
		</div>
	);
}
export default Page;

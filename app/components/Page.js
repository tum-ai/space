function Page({ className, children }) {
	return (
		<div className='h-full w-full'>
			<div className='lg:p-12 p-4 pt-16 lg:pt-16'>{children}</div>
		</div>
	);
}
export default Page;

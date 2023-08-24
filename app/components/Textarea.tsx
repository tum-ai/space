function Textarea({ label, ...props }) {
	return (
		<div className='flex w-full flex-col space-y-2'>
			{label && <label className='text-sm font-thin'>{label}</label>}
			<textarea
				{...props}
				className='rounded-lg dark:border-gray-500 bg-white p-4 outline-none dark:bg-gray-700 min-h-[200px]'
			/>
		</div>
	);
}

export default Textarea;

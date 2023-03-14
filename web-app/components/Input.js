function Input({ label, ...props }) {
	return (
		<div className='flex flex-col space-y-2'>
			{label && <label className='text-sm font-thin'>{label}</label>}
			<input
				{...props}
				className='p-2 rounded border bg-gray-100 dark:bg-gray-700 outline-none'
			/>
		</div>
	);
}

export default Input;

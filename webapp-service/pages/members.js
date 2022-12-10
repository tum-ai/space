import Page from 'components/Page';

export default function Home() {
	return (
		<Page>
			<div className='text-2xl font-light'>Members of TUM.ai</div>
			<br />
			<br />
			<div className='font-light text-gray-600'>Total 78 members</div>
			<br />
			<div className='flex flex-col space-y-4'>
				<div className='flex space-x-4'>
					<img
						className='rounded-full w-14 h-14 object-cover border drop-shadow-lg'
						src='https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
						alt='me'
					/>
					<div className='flex flex-col'>
						<div className='font-bold'>Max Mustermann</div>
						<div className='text-green-500'>Industry</div>
					</div>
				</div>
				<hr />
			</div>
		</Page>
	);
}

import { Image } from 'next/image';
import Link from 'next/link';
import Icon from '/components/Icon';

function ProfileRow({ profile }) {
	return (
		<div className='flex space-x-10 justify-between bg-white dark:bg-gray-700 p-4 rounded-xl shadow'>
			<div className='grid grid-cols-2 gap-4 lg:flex lg:justify-around lg:space-x-6 lg:items-center w-full'>
				{/* profile picture */}
				{profile.picture ? (
					<Image
						className='rounded-full w-14 h-14 object-cover border'
						src={profile.picture}
						alt='me'
					/>
				) : (
					<div className='rounded-full w-14 h-14 bg-gray-300 dark:bg-gray-800 flex text-center drop-shadow-lg'>
						<Icon
							name={'FaUser'}
							className='m-auto text-xl text-white'
						/>
					</div>
				)}
				{/* profile name and department */}
				<div className='flex flex-col lg:w-1/4 col-span-2'>
					<div className='font-bold'>
						{profile.first_name + ' ' + profile.last_name}
					</div>
					<div className={' font-light'}>
						{profile.department || '-'}
					</div>
				</div>
				{/* role */}
				<div className='flex flex-col items-start lg:w-1/4'>
					<div className='text-xs text-gray-400 font-light'>ROLE</div>
					<div className='font-light text-sm'>{profile.role}</div>
				</div>
				{/* descriptio  */}
				<div className='flex flex-col items-start lg:w-1/4'>
					<div className='text-xs text-gray-400 font-light'>
						DESCRIPTION
					</div>
					<div className='font-light text-sm'>
						{profile.description || '-'}
					</div>
				</div>
			</div>
			<div className='flex items-center justify-end w-auto'>
				<Link href={'/profiles/' + profile.id}>
					<Icon
						name={'FaExternalLinkAlt'}
						className='p-2 rounded hover:scale-105 bg-gray-100 dark:bg-black'
					/>
				</Link>
			</div>
		</div>
	);
}

export default ProfileRow;

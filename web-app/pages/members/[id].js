import Page from 'components/Page';
import { useRouter } from 'next/router';
import Icon from '/components/Icon';
import { useRootModel } from '/providers/RootStoreProvider';

const DEPARTMENTTOCOLOR = {
	marketing: 'green',
	industry: 'blue',
	dev: 'red',
};

export default function Member() {
	return (
		<Page>
			<Profile />
		</Page>
	);
}

function Profile() {
	const rootModel = useRootModel();
	const router = useRouter();
	const { id } = router.query;
	const membersModel = rootModel.membersModel;
	const profile = {
		...membersModel.members.find((obj) => {
			return obj.profileID === id;
		}),
	};

	return (
		<div className='flex flex-col space-y-8'>
			{/* name + image */}
			<div className='flex flex-row justify-between w-full'>
				<div className='flex flex-col space-y-4 items-start'>
					<div className='font-thin text-6xl'>{profile.name}</div>
				</div>
				{profile.picture ? (
					<img
						className='rounded-full w-28 h-28 object-cover border drop-shadow-lg'
						src={profile.picture}
						alt='me'
					/>
				) : (
					<div className='rounded-full w-28 h-28 bg-gray-300 flex text-center drop-shadow-lg'>
						<Icon
							name={'FaUser'}
							className='m-auto text-4xl text-white'
						/>
					</div>
				)}
			</div>
			{/* department */}
			<div className='flex flex-col'>
				<div className='text-base text-gray-400 font-light'>
					DEPARTMENT
				</div>
				<div
					className='font-light text-base'
					style={{
						color: DEPARTMENTTOCOLOR[
							profile.department?.toLowerCase()
						],
					}}
				>
					{profile.department}
				</div>
			</div>
			{/* degree */}
			<div className='flex flex-col'>
				<div className='text-base text-gray-400 font-light'>DEGREE</div>
				<div className='font-light text-base'>
					{profile.degreeLevel + ' '} {profile.degreeName}
				</div>
			</div>
			{/* semester */}
			<div className='flex flex-col'>
				<div className='text-base text-gray-400 font-light'>
					SEMESTER
				</div>
				<div className='font-light text-base'>
					{profile.degreeSemester}
				</div>
			</div>
			{/* university */}
			<div className='flex flex-col'>
				<div className='text-base text-gray-400 font-light'>
					UNIVERSITY
				</div>
				<div className='font-light text-base'>{profile.university}</div>
			</div>
			{/* description  */}
			<div className='flex flex-col'>
				<div className='text-base text-gray-400 font-light'>
					DESCRIPTION
				</div>
				<div className='font-light text-base'>
					{profile.description || '-'}
				</div>
			</div>
		</div>
	);
}

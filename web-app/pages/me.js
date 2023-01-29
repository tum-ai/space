import Page from 'components/Page';
import { observer } from 'mobx-react';
import { useRootModel } from '/providers/RootStoreProvider';

const DEPARTMENTTOCOLOR = {
	marketing: 'green',
	industry: 'blue',
	dev: 'red',
};

export default function Me() {
	return (
		<Page>
			<Profile />
		</Page>
	);
}

const Profile = observer(() => {
	const rootModel = useRootModel();
	const meModel = rootModel.meModel;
	const profile = meModel.profile;

	return (
		<div className='flex flex-col space-y-8'>
			{/* name + image */}
			<div className='flex flex-row justify-between w-full'>
				<div className='font-thin text-6xl'>{profile.name}</div>
				<img
					className='rounded-full w-28 h-28 object-cover border drop-shadow-lg'
					src={profile.picture}
					alt='me'
				/>
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
							profile.department.toLowerCase()
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
				{/* university */}
			</div>
			<div className='flex flex-col'>
				<div className='text-base text-gray-400 font-light'>
					UNIVERSITY
				</div>
				<div className='font-light text-base'>{profile.university}</div>
			</div>
		</div>
	);
});

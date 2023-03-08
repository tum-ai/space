import Page from 'components/Page';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Icon from '/components/Icon';
import { useRootModel } from '/providers/RootStoreProvider';

const DEPARTMENTTOCOLOR = {
	marketing: '',
	industry: '',
	dev: '',
};

export default function Member() {
	return (
		<Page>
			<Profile />
		</Page>
	);
}

const Profile = observer(() => {
	const rootModel = useRootModel();
	const router = useRouter();
	const { id } = router.query;
	const memberModel = rootModel.memberModel;
	useEffect(() => {
		if (id) {
			memberModel.fetchMember(id);
		}
	}, [id]);
	const profile = memberModel.member;

	if (memberModel.loading) {
		return <div>Loading...</div>;
	}

	if (memberModel.error) {
		return <div>An error occured. Could not fetch profile.</div>;
	}

	return (
		<div className='grid grid-cols-2 gap-10 m-auto w-1/2 bg-white dark:bg-gray-700 p-8 px-10 rounded-xl'>
			{/* name + image */}
			<div className=' col-span-2 flex flex-col items-start max-w-90 space-y-6'>
				{profile.picture ? (
					<img
						className='rounded-full w-28 h-28 object-cover border drop-shadow-lg m-auto'
						src={profile.picture}
						alt='me'
					/>
				) : (
					<div className='rounded-full w-28 h-28 bg-gray-300 dark:bg-gray-800 flex text-center drop-shadow-lg m-auto'>
						<Icon
							name={'FaUser'}
							className='m-auto text-4xl text-white'
						/>
					</div>
				)}
				<div className='flex space-x-4 items-end'>
					<div className='font-thin text-6xl'>{profile.name}</div>
					{profile.socialNetworks &&
						profile.socialNetworks.map((sn) => (
							<a href={sn.link}>
								{sn.type == 'Other' ? (
									<Icon
										name={'FaGlobe'}
										className='p-2 rounded-full hover:scale-105'
									/>
								) : (
									<Icon
										name={'Fa' + sn.type}
										className='p-2 rounded-full hover:scale-105'
									/>
								)}
							</a>
						))}
				</div>
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
			{/* previous departments  */}
			<div className='flex flex-col'>
				<div className='text-base text-gray-400 font-light'>
					PREVIOUS DEPARTMENTS
				</div>
				<div className='font-light text-base'>
					{(profile.previousDepartments?.length &&
						profile.previousDepartments.join(', ')) ||
						'-'}
				</div>
			</div>
			{/* current job */}
			<div className='flex flex-col'>
				<div className='text-base text-gray-400 font-light'>
					CURRENT JOB
				</div>
				<div className='font-light text-base'>
					{profile.currentJob || '-'}
				</div>
			</div>
			{/* nationality */}
			<div className='flex flex-col'>
				<div className='text-base text-gray-400 font-light'>
					NATIONALITY
				</div>
				<div className='font-light text-base'>
					{profile.nationality || '-'}
				</div>
			</div>
		</div>
	);
});

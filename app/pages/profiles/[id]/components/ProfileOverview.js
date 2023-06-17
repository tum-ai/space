import { observer } from 'mobx-react';
import { Image } from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ProfileEditor from './ProfileEditor';
import Icon from '/components/Icon';
import { useAuth } from '/providers/AuthContextProvider';
import { useStores } from '/providers/StoreProvider';

function ProfileOverview() {
	const { profileModel, uiModel } = useStores();
	const router = useRouter();
	const { user } = useAuth();
	const { id } = router.query;
	useEffect(() => {
		if (id) {
			profileModel.getProfile(id);
		}
	}, [profileModel, id]);
	const profile = profileModel.profile;

	if (profileModel.loading) {
		return <div>Loading...</div>;
	}

	if (profileModel.error) {
		return <div>{profileModel.error}</div>;
	}

	if (!profile) {
		return <div>Profile not found.</div>;
	}
	const isSelf = user?.uid == profileModel.profile?.firebase_uid;

	return (
		<div className='m-auto max-w-3xl bg-white dark:bg-gray-700'>
			<div className='w-full flex justify-end'>
				{isSelf && (
					<button
						className='right-0 p-2'
						onClick={() => {
							uiModel.updateModalContent(<ProfileEditor />);
							uiModel.toggleModal();
							profileModel.editorProfile = { ...profile };
						}}
					>
						<Icon
							name={'FaEdit'}
							className='p-2 rounded hover:scale-105 bg-gray-100 dark:bg-black'
						/>
					</button>
				)}
			</div>
			<div className='grid grid-cols-1 xl:grid-cols-2 gap-10 p-8 px-4 lg:px-10 rounded-xl'>
				{/* name + image */}
				<div className=' xl:col-span-2 flex flex-col items-start max-w-90 space-y-6'>
					{profile.picture ? (
						<Image
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
					<div className='flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:space-x-4 lg:items-end'>
						<div className='font-thin text-6xl'>
							{profile.first_name + ' ' + profile.last_name}
						</div>
						{profile.socialNetworks &&
							profile.socialNetworks.map((sn) => (
								<a key={sn.link} href={sn.link}>
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
					<div className='font-light text-base'>
						{profile.department || '-'}
					</div>
				</div>
				{/* degree */}
				<div className='flex flex-col'>
					<div className='text-base text-gray-400 font-light'>
						DEGREE
					</div>
					<div className='font-light text-base'>
						{profile.degree_level + ' '} {profile.degree_name}
					</div>
				</div>
				{/* semester */}
				<div className='flex flex-col'>
					<div className='text-base text-gray-400 font-light'>
						SEMESTER
					</div>
					<div className='font-light text-base'>
						{profile.degree_semester || '-'}
					</div>
				</div>
				{/* university */}
				<div className='flex flex-col'>
					<div className='text-base text-gray-400 font-light'>
						UNIVERSITY
					</div>
					<div className='font-light text-base'>
						{profile.university}
					</div>
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
		</div>
	);
}

export default observer(ProfileOverview);

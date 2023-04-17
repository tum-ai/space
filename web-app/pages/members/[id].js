import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Icon from '/components/Icon';
import Modal from '/components/Modal';
import Page from '/components/Page';
import { useRootModel } from '/providers/RootStoreProvider';

const DEPARTMENTTOCOLOR = {
	marketing: '',
	industry: '',
	dev: '',
};

export default function Member() {
	return (
		<Page>
			<ProfileEditor />
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
			// TODO: id=me needs a different endpoint!
			memberModel.fetchMember(id);
		}
	}, [id]);
	const profile = memberModel.member;

	if (memberModel.loading) {
		return <div>Loading...</div>;
	}

	if (memberModel.error) {
		return <div>{memberModel.error}</div>;
	}

	if (!profile) {
		return <div>Profile not found.</div>;
	}

	return (
		<div className='m-auto max-w-3xl bg-white dark:bg-gray-700'>
			<div className='w-full flex justify-end'>
				{router.asPath == '/members/me' && (
					<button
						className='right-0 p-2'
						onClick={() => {
							memberModel.toggleEditor();
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
					<div className='flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:space-x-4 lg:items-end'>
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
					<div className='text-base text-gray-400 font-light'>
						DEGREE
					</div>
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
});

const ProfileEditor = observer(() => {
	const rootModel = useRootModel();
	const profileEditorModel = rootModel.memberModel;
	const editorProfile = profileEditorModel.editorMember;

	function handleChange(e) {
		profileEditorModel.updateEditorMember({
			[e.target.name]: e.target.value,
		});
	}

	return (
		<Modal
			state={profileEditorModel.editorActive}
			setState={() => {
				profileEditorModel.toggleEditor();
			}}
		>
			<div className='flex flex-col space-y-6 rounded-lg p-6 bg-white dark:bg-gray-700 w-full'>
				<div className='text-2xl font-light'>Edit profile</div>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						await profileEditorModel.editProfile();
					}}
					className='flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:space-y-0 lg:gap-8'
				>
					<Input
						label='Full name'
						type='text'
						id='name'
						name='name'
						value={editorProfile.name}
						onChange={handleChange}
						required={true}
					/>
					<Input
						label='Nationality'
						type='text'
						id='nationality'
						name='nationality'
						value={editorProfile.nationality}
						onChange={handleChange}
						required={true}
					/>
					<Input
						label='University'
						type='text'
						id='university'
						name='university'
						value={editorProfile.university}
						onChange={handleChange}
						required={true}
					/>
					<Input
						label='Degree level'
						type='text'
						id='degreeLevel'
						name='degreeLevel'
						value={editorProfile.degreeLevel}
						onChange={handleChange}
						required={true}
					/>
					<Input
						label='Degree name'
						type='text'
						id='degreeName'
						name='degreeName'
						value={editorProfile.degreeName}
						onChange={handleChange}
						required={true}
					/>
					<Input
						label='Semester'
						type='number'
						id='degreeSemester'
						name='degreeSemester'
						value={editorProfile.degreeSemester}
						onChange={handleChange}
						required={true}
					/>
					<Input
						label='Current job'
						type='text'
						id='currentJob'
						name='currentJob'
						value={editorProfile.currentJob}
						onChange={handleChange}
					/>
					{/* <Input
						label='Description'
						type='text'
						id='degreeSemester'
						name='degreeSemester'
						value={editorProfile.degreeSemester}
						onChange={handleChange}
						required={true}
					/> */}
					<div className='col-span-2'>
						<Textarea
							label='Description'
							type='text'
							id='description'
							name='description'
							value={editorProfile.description}
							onChange={handleChange}
							required={false}
						/>
					</div>
					<div className='col-span-2 flex space-x-2'>
						<button
							type='submit'
							className='p-4 px-8 py-1 rounded-lg w-1/2 bg-gray-200 text-black'
						>
							<div>save</div>
						</button>
						<button
							onClick={() => {
								profileEditorModel.toggleEditor();
							}}
							className='p-4 px-8 py-1 rounded-lg w-1/2 border-2'
						>
							<div>cancel</div>
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
});

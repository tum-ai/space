import Page from '/components/Page';
import { observer } from 'mobx-react';
import Icon from '/components/Icon';
import Modal from '/components/Modal';
import { useRootModel } from '/providers/RootStoreProvider';

const DEPARTMENTTOCOLOR = {
	marketing: 'green',
	industry: 'blue',
	dev: 'red',
};

export default function Me() {
	return (
		<Page>
			<ProfileEditor />
			<Profile />
		</Page>
	);
}

const ProfileEditor = observer(() => {
	const rootModel = useRootModel();
	const profileEditorModel = rootModel.profileModel;
	const editorProfile = profileEditorModel.editorProfile;

	function handleChange(e) {
		profileEditorModel.updateEditorProfile({
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
			<div className='flex flex-col p-6 bg-white w-96 slide-in'>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						profileEditorModel.saveProfile();
						profileEditorModel.toggleEditor();
					}}
					className='flex flex-col space-y-4'
				>
					<label htmlFor='first'>Full name:</label>
					<input
						type='text'
						id='name'
						name='name'
						value={editorProfile.name}
						onChange={handleChange}
						required={true}
						className='border border-black border-r-2'
					/>
					<label htmlFor='first'>Semester:</label>
					<input
						type='number'
						id='degreeSemester'
						name='degreeSemester'
						value={editorProfile.degreeSemester}
						onChange={handleChange}
						required={true}
						max={9}
						min={1}
						className='border border-black border-r-2'
					/>
					<label htmlFor='first'>Degree:</label>
					<input
						type='text'
						id='degreeName'
						name='degreeName'
						value={editorProfile.degreeName}
						onChange={handleChange}
						required={true}
						className='border border-black border-r-2'
					/>
					<label htmlFor='first'>Degree level:</label>
					<input
						type='text'
						id='degreeLevel'
						name='degreeLevel'
						value={editorProfile.degreeLevel}
						onChange={handleChange}
						required={true}
						className='border border-black border-r-2'
					/>
					<label htmlFor='first'>Description:</label>
					<textarea
						type='text'
						id='description'
						name='description'
						value={editorProfile.description}
						onChange={handleChange}
						required={false}
						className='border border-black border-r-2'
					/>
					<button
						type='submit'
						className='p-4 py-1 rounded-full text-white bg-purple-700 hover:bg-purple-500'
					>
						<div>save</div>
					</button>
					<button
						onClick={() => {
							profileEditorModel.toggleEditor();
						}}
						className='p-4 py-1 rounded-full text-black bg-gray-300 hover:bg-gray-200'
					>
						<div>cancel</div>
					</button>
				</form>
			</div>
		</Modal>
	);
});

const Profile = observer(() => {
	const rootModel = useRootModel();
	const profileModel = rootModel.profileModel;
	const profile = profileModel.profile;

	return (
		<div className='flex flex-col space-y-8'>
			{/* name + image */}
			<div className='flex flex-row justify-between w-full'>
				<div className='flex flex-col space-y-4 items-start'>
					<div className='font-thin text-6xl'>{profile.name}</div>
					<div>
						<button
							onClick={() => {
								profileModel.toggleEditor();
							}}
							className='flex items-center space-x-2 p-4 py-1 rounded-full text-white bg-purple-700 hover:bg-purple-500'
						>
							<Icon name={'FaEdit'} className='' />
							<div>edit</div>
						</button>
					</div>
				</div>
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
});

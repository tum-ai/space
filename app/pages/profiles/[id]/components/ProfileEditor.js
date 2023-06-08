import { observer } from 'mobx-react';
import Input from '/components/Input';
import Modal from '/components/Modal';
import Textarea from '/components/Textarea';
import { useRootModel } from '/providers/RootStoreProvider';

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
						label='First name'
						type='text'
						id='first_name'
						name='first_name'
						value={editorProfile.first_name}
						onChange={handleChange}
						required={true}
					/>
					<Input
						label='Last name'
						type='text'
						id='last_name'
						name='last_name'
						value={editorProfile.last_name}
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
						id='degree_level'
						name='degree_level'
						value={editorProfile.degree_level}
						onChange={handleChange}
						required={true}
					/>
					<Input
						label='Degree name'
						type='text'
						id='degree_name'
						name='degree_name'
						value={editorProfile.degree_name}
						onChange={handleChange}
						required={true}
					/>
					<Input
						label='Semester'
						type='number'
						id='degree_semester'
						name='degree_semester'
						value={editorProfile.degree_semester}
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
export default ProfileEditor;

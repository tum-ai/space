import { observer } from 'mobx-react';
import { useAuth } from '../../../providers/AuthContextProvider';
import Input from '/components/Input';
import Textarea from '/components/Textarea';
import { useStores } from '/providers/StoreProvider';

function ProfileEditor() {
	const { uiModel, meModel } = useStores();
	const editorProfile = meModel.editorProfile;
	const { getProfile } = useAuth();

	function handleChange(e) {
		meModel.updateEditorProfile({
			[e.target.name]: e.target.value,
		});
	}

	return (
		<div className='flex flex-col space-y-6 rounded-lg p-6 bg-white dark:bg-gray-700 w-full'>
			<div className='text-2xl font-light'>Edit profile</div>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					await meModel.editProfile();
					getProfile();
					uiModel.toggleModal();
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
							uiModel.toggleModal();
						}}
						className='p-4 px-8 py-1 rounded-lg w-1/2 border-2'
					>
						<div>cancel</div>
					</button>
				</div>
			</form>
		</div>
	);
}

export default observer(ProfileEditor);

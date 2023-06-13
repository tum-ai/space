import { observer } from 'mobx-react';
import ProtectedItem from '../components/ProtectedItem';
import Page from '/components/Page';
import Textarea from '/components/Textarea';
import { useStores } from '/providers/StoreProvider';

const Invite = observer(() => {
	const { inviteModel } = useStores();
	const text = inviteModel.text;
	function handleChange(e) {
		inviteModel.text = e.target.value;
	}
	return (
		<ProtectedItem roles={['invite_members']}>
			<Page>
				<div className='font-thin text-6xl'>Invite Members</div>
				<br />
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						await inviteModel.invite();
					}}
					className='flex flex-col space-y-8 items-start w-full lg:w-1/2'
				>
					<Textarea
						label='New members'
						placeholder='email,first_name,last_name,department_handle,department_position'
						type='text'
						id='description'
						name='description'
						value={text}
						onChange={handleChange}
						required={true}
					/>
					<button
						type='submit'
						className='p-4 px-8 py-1 rounded-lg w-1/2 bg-gray-200 text-black'
					>
						<div>invite</div>
					</button>
				</form>
			</Page>
		</ProtectedItem>
	);
});

export default Invite;

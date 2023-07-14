import { observer } from 'mobx-react';
import { Image } from 'next/image';
import Link from 'next/link';
import DepartmentMembershipEditor from './DepartmentMembershipEditor';
import Icon from '/components/Icon';
import ProtectedItem from '/components/ProtectedItem';
import SelectMultiple from '/components/SelectMultiple';
import { useStores } from '/providers/StoreProvider';

function ProfileRow({ profile }) {
	const { rolesModel, meModel, uiModel } = useStores();
	const user = meModel.user;
	const user_profile = user?.profile;
	const roleHolderships = rolesModel.roleHolderships[profile.id] || [];

	return (
		<div className='flex space-x-10 justify-between bg-white dark:bg-gray-700 p-4 rounded-xl shadow'>
			<div className='grid grid-cols-2 gap-2 w-full'>
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
				<div className='flex flex-col gap-y-1'>
					<ProtectedItem roles={['admin']}>
						<div className='flex items-center justify-end w-auto'>
							<button
								onClick={() => {
									uiModel.updateModalContent(
										<DepartmentMembershipEditor
											profile_id={profile.id}
										/>
									);
									uiModel.toggleModal();
									meModel.editorProfile = { ...user_profile };
								}}
							>
								<Icon
									name={'FaEdit'}
									className='p-2 rounded hover:scale-105 bg-gray-100 dark:bg-black'
								/>
							</button>
						</div>
					</ProtectedItem>
					<div className='flex items-center justify-end w-auto'>
						<Link href={'/profiles/' + profile.id}>
							<Icon
								name={'FaExternalLinkAlt'}
								className='p-2 rounded hover:scale-105 bg-gray-100 dark:bg-black'
							/>
						</Link>
					</div>
				</div>
				{/* profile name and department */}
				<div className='flex flex-col col-span-2'>
					<div className='font-bold'>
						{profile.first_name + ' ' + profile.last_name}
					</div>
				</div>
				<ProtectedItem roles={['admin']}>
					<div className='col-span-2'>
						<SelectMultiple
							className='bg-white dark:bg-gray-700'
							placeholder={'Roles'}
							data={
								rolesModel.roles?.map((role) => ({
									key: (
										<div>
											<b>{role.handle}: </b>
											{role.description}
										</div>
									),
									value: role.handle,
								})) || []
							}
							selectedItems={roleHolderships.map((role) => ({
								key: role,
								value: role,
							}))}
							setSelectedItems={async (items) => {
								items = items.map((item) => item['value']);
								const newRoles = items.filter(
									(item) => !roleHolderships.includes(item)
								);
								const deletedRoles = roleHolderships.filter(
									(role) => !items.includes(role)
								);
								const method = newRoles.length
									? 'create'
									: 'delete';
								let data = newRoles.length
									? newRoles
									: deletedRoles;
								data = data.map((item) => ({
									profile_id: profile.id,
									role_handle: item,
									method: method,
								}));
								await rolesModel.updateRoles(data);
								rolesModel.setProfileRoles(profile.id, items);
							}}
						></SelectMultiple>
					</div>
				</ProtectedItem>
			</div>
		</div>
	);
}

export default observer(ProfileRow);

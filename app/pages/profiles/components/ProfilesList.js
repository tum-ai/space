import { observer } from 'mobx-react';
import ProfileRow from './ProfileRow';
import Icon from '/components/Icon';
import Select from '/components/Select';
import { useStores } from '/providers/StoreProvider';

function ProfilesList() {
	const { profilesModel } = useStores();

	return (
		<div className='flex flex-col space-y-4'>
			<div className='flex flex-col space-y-10 justify-end'>
				<div className='font-light text-gray-500 mt-2'>
					Total {profilesModel.filteredProfiles.length} members
				</div>
				<div className='w-full flex'>
					<div className='m-auto bg-white dark:bg-gray-700 rounded w-full lg:w-1/2 p-2 flex space-x-4'>
						<Icon name={'FaSearch'} className='p-2 rounded' />
						<input
							value={profilesModel.search}
							onChange={(e) => {
								profilesModel.setSearch(e.target.value);
							}}
							placeholder='search..'
							className='w-full bg-transparent outline-none'
						></input>
						{profilesModel.search && (
							<button
								onClick={(e) => {
									profilesModel.setSearch('');
								}}
							>
								clear
							</button>
						)}
					</div>
				</div>
				<div className='flex flex-col space-y-2 lg:flex-row lg:space-x-4 items-start lg:items-end'>
					<div className='space-x-2'>
						<span className='font-thin'>filters: </span>
						{Object.keys(profilesModel.filter).length > 0 && (
							<button
								onClick={() => profilesModel.resetFilters()}
							>
								reset
							</button>
						)}
					</div>
					<Select
						className='bg-white dark:bg-gray-700'
						placeholder={'Department'}
						data={[
							{ key: 'all', value: null },
							...profilesModel
								.getDepartments()
								.map((department) => ({
									key: department,
									value: department,
								})),
						]}
						selectedItem={{
							key: profilesModel.filter.department,
							value: profilesModel.filter.department,
						}}
						setSelectedItem={(item) => {
							profilesModel.setFilter(
								'department',
								item ? item.value : ''
							);
						}}
					/>
					<Select
						className='bg-white dark:bg-gray-700'
						placeholder={'Role'}
						data={[
							{ key: 'all', value: null },
							...profilesModel.getRoles().map((role) => ({
								key: role,
								value: role,
							})),
						]}
						selectedItem={{
							key: profilesModel.filter.role,
							value: profilesModel.filter.role,
						}}
						setSelectedItem={(item) => {
							profilesModel.setFilter(
								'role',
								item ? item.value : ''
							);
						}}
					/>
					<Select
						className='bg-white dark:bg-gray-700'
						placeholder={'Sort by'}
						data={[
							{ key: 'none', value: null },
							{ key: 'name', value: 'first_name' },
							{ key: 'department', value: 'department' },
						]}
						selectedItem={{
							key: profilesModel.sortBy,
							value: profilesModel.sortBy,
						}}
						setSelectedItem={(item) => {
							profilesModel.setSortBy(item?.value || '');
						}}
					/>
				</div>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
				{profilesModel.filteredProfiles.map((profile, i) => (
					<ProfileRow key={i} profile={profile} />
				))}
			</div>
		</div>
	);
}

export default observer(ProfilesList);

import { observer } from 'mobx-react';
import Link from 'next/Link';
import Icon from '/components/Icon';
import Page from '/components/Page';
import Select from '/components/Select';
import { useRootModel } from '/providers/RootStoreProvider';

const DEPARTMENTTOCOLOR = {
	marketing: '',
	industry: '',
	dev: '',
};

export default function Members() {
	return (
		<Page>
			<div className='font-thin text-6xl'>Members</div>
			<MembersList />
		</Page>
	);
}

const MembersList = observer(() => {
	const rootModel = useRootModel();
	const membersModel = rootModel.membersModel;

	return (
		<div className='flex flex-col space-y-2'>
			<div className='flex flex-col space-y-10 justify-end'>
				<div className='font-light text-gray-500 mt-2'>
					Total {membersModel.filteredMembers.length} members
				</div>
				<div className='w-full flex'>
					<div className='m-auto bg-white dark:bg-gray-700 rounded w-full lg:w-1/2 p-2 flex space-x-4'>
						<Icon name={'FaSearch'} className='p-2 rounded' />
						<input
							value={membersModel.search}
							onChange={(e) => {
								membersModel.setSearch(e.target.value);
							}}
							placeholder='search..'
							className='w-full bg-transparent outline-none'
						></input>
						{membersModel.search && (
							<button
								onClick={(e) => {
									membersModel.setSearch('');
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
						{Object.keys(membersModel.filter).length > 0 && (
							<button onClick={() => membersModel.resetFilters()}>
								reset
							</button>
						)}
					</div>
					<Select
						className='bg-white dark:bg-gray-700'
						placeholder={'Department'}
						data={[
							{ key: 'all', value: null },
							...membersModel
								.getDepartments()
								.map((department) => ({
									key: department,
									value: department,
								})),
						]}
						selectedItem={{
							key: membersModel.filter.department,
							value: membersModel.filter.department,
						}}
						setSelectedItem={(item) => {
							membersModel.setFilter(
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
							...membersModel.getRoles().map((role) => ({
								key: role,
								value: role,
							})),
						]}
						selectedItem={{
							key: membersModel.filter.role,
							value: membersModel.filter.role,
						}}
						setSelectedItem={(item) => {
							membersModel.setFilter(
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
							{ key: 'name', value: 'name' },
							{ key: 'department', value: 'department' },
						]}
						selectedItem={{
							key: membersModel.sortBy,
							value: membersModel.sortBy,
						}}
						setSelectedItem={(item) => {
							membersModel.setSortBy(item?.value || '');
						}}
					/>
				</div>
			</div>
			{membersModel.filteredMembers.map((member, i) => (
				<Member key={i} member={member} />
			))}
		</div>
	);
});

function Member({ member }) {
	return (
		<div className='flex space-x-10 justify-between bg-white dark:bg-gray-700 p-4 rounded-xl shadow'>
			<div className='grid grid-cols-2 gap-4 lg:flex lg:justify-around lg:space-x-6 lg:items-center w-full'>
				{/* profile picture */}
				{member.picture ? (
					<img
						className='rounded-full w-14 h-14 object-cover border'
						src={member.picture}
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
				{/* profile name and department */}
				<div className='flex flex-col lg:w-1/4'>
					<div className='font-bold'>{member.name}</div>
					<div
						className={' font-light'}
						style={{
							color: DEPARTMENTTOCOLOR[
								member.department.toLowerCase()
							],
						}}
					>
						{member.department}
					</div>
				</div>
				{/* role */}
				<div className='flex flex-col items-start lg:w-1/4'>
					<div className='text-xs text-gray-400 font-light'>ROLE</div>
					<div className='font-light text-sm'>{member.role}</div>
				</div>
				{/* descriptio  */}
				<div className='flex flex-col items-start lg:w-1/4'>
					<div className='text-xs text-gray-400 font-light'>
						DESCRIPTION
					</div>
					<div className='font-light text-sm'>
						{member.description || '-'}
					</div>
				</div>
			</div>
			<div className='flex items-center justify-end w-auto'>
				<Link href={'/members/' + member._id}>
					<Icon
						name={'FaExternalLinkAlt'}
						className='p-2 rounded hover:scale-105 bg-gray-100 dark:bg-black'
					/>
				</Link>
			</div>
		</div>
	);
}

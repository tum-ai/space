import Page from 'components/Page';
import { observer } from 'mobx-react';
import Link from 'next/Link';
import Icon from '/components/Icon';
import Select from '/components/Select';
import { useRootModel } from '/providers/RootStoreProvider';

const DEPARTMENTTOCOLOR = {
	marketing: 'green',
	industry: 'blue',
	dev: 'red',
};

export default function Members() {
	return (
		<Page>
			<div className='text-4xl font-light'>Members</div>
			<MembersList />
			<br />
			<br />
			<br />
			<br />
		</Page>
	);
}

const MembersList = observer(() => {
	const rootModel = useRootModel();
	const membersModel = rootModel.membersModel;

	return (
		<div className='flex flex-col space-y-6'>
			<div className='flex flex-col space-y-6 justify-end'>
				<div className='font-light text-gray-600'>
					Total {membersModel.filteredMembers.length} members
				</div>
				<div className='flex space-x-4 items-end'>
					<div className='text-gray-700'>filters:</div>
					<Select
						className='bg-white'
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
						className='bg-white'
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
					{Object.keys(membersModel.filter).length > 0 && (
						<button onClick={() => membersModel.resetFilters()}>
							reset
						</button>
					)}
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
		<div className='space-y-4 bg-white p-4 rounded-xl shadow'>
			<div className='flex space-x-4 items-center'>
				{/* profile picture */}
				{member.picture ? (
					<img
						className='rounded-full w-14 h-14 object-cover border'
						src={member.picture}
						alt='me'
					/>
				) : (
					<div className='rounded-full w-14 h-14 bg-gray-300 flex text-center drop-shadow-lg'>
						<Icon
							name={'FaUser'}
							className='m-auto text-xl text-white'
						/>
					</div>
				)}
				{/* profile name and department */}
				<div className='flex flex-col w-1/6'>
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
				{/* profile details */}
				<div className='grid gap-x-16 gap-y-0 grid-cols-4 grid-rows-1 auto-cols-fr w-4/6'>
					<div className='flex flex-col items-start'>
						<div className='text-xs text-gray-400 font-light'>
							ROLE
						</div>
						<div className='font-light text-sm'>{member.role}</div>
					</div>
					<div className='flex flex-col items-start'>
						<div className='text-xs text-gray-400 font-light'>
							DESCRIPTION
						</div>
						<div className='font-light text-sm'>
							{member.description}
						</div>
					</div>
				</div>
				<div className='flex items-center justify-end'>
					<Link href={'/members/' + member._id}>
						<Icon
							name={'FaExternalLinkAlt'}
							className='p-2 rounded-full text-purple-400 hover:scale-105'
						/>
					</Link>
					<a href={'tum-ai.com'}>
						<Icon
							name={'FaLinkedinIn'}
							className='p-2 rounded-full hover:scale-105'
						/>
					</a>
					<a href={'tum-ai.com'}>
						<Icon
							name={'FaGithub'}
							className='p-2 rounded-full hover:scale-105'
						/>
					</a>
				</div>
			</div>
		</div>
	);
}

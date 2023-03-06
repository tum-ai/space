import Page from '../components/Page';
import { observer } from 'mobx-react';
import Icon from '../components/Icon';
import Select from '../components/Select';
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
			<br />
			<br />
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
			<div className='flex space-x-6 items-end'>
				<div className='font-light text-gray-600'>
					Total {membersModel.filteredMembers.length} members
				</div>
				<div className='text-gray-700'>filters:</div>
				<Select
					placeholder={'Department'}
					data={[
						{ key: 'all', value: null },
						...membersModel.getDepartments().map((department) => ({
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
					placeholder={'Degree'}
					data={[
						{ key: 'all', value: null },
						...membersModel.getDegrees().map((degree) => ({
							key: degree,
							value: degree,
						})),
					]}
					selectedItem={{
						key: membersModel.filter.degreeName,
						value: membersModel.filter.degreeName,
					}}
					setSelectedItem={(item) => {
						membersModel.setFilter(
							'degreeName',
							item ? item.value : ''
						);
					}}
				/>
			</div>
			{membersModel.filteredMembers.map((member, i) => (
				<Member key={i} member={member} />
			))}
		</div>
	);
});

function Member({ member }) {
	return (
		<div className='space-y-4'>
			<div className='flex space-x-4 items-center'>
				{/* profile picture */}
				{member.picture ? (
					<img
						className='rounded-full w-14 h-14 object-cover border drop-shadow-lg'
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
					<div className='flex flex-col items-center'>
						<div className='text-xs text-gray-400 font-light'>
							DEGREE
						</div>
						<div className='font-light text-sm text-center'>
							{member.degreeLevel + ' '} {member.degreeName}
						</div>
					</div>
					<div className='flex flex-col items-center'>
						<div className='text-xs text-gray-400 font-light'>
							SEMESTER
						</div>
						<div className='font-light text-sm'>
							{member.degreeSemester}
						</div>
					</div>
					<div className='flex flex-col items-center'>
						<div className='text-xs text-gray-400 font-light'>
							DEGREE
						</div>
						<div className='font-light text-sm'>
							Computer Science
						</div>
					</div>
					<div className='flex flex-col items-center'>
						<div className='text-xs text-gray-400 font-light'>
							UNIVERSITY
						</div>
						<div className='font-light text-sm'>
							{member.university}
						</div>
					</div>
				</div>
				<div className='flex items-center justify-end'>
					<a href={'/members/' + member.profileID}>
						<Icon
							name={'FaExternalLinkAlt'}
							className='p-2 rounded-full text-purple-400 hover:scale-105'
						/>
					</a>
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
			<hr />
		</div>
	);
}

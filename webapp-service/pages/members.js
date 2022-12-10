import Page from 'components/Page';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import Icon from '../components/Icon';
import membersModel from '/models/Members';

export default function Members() {
	return (
		<Page>
			<div className='text-4xl font-light'>Members</div>
			<br />
			<br />
			<MembersList />
		</Page>
	);
}

const MembersList = observer(() => {
	useEffect(() => {
		console.log('use effect');
		membersModel.loadMembers();
		// eslint-disable-next-line
	}, []);

	return (
		<div className='flex flex-col space-y-4'>
			<div className='font-light text-gray-600'>
				Total {membersModel.members.length} members
			</div>
			{membersModel.members.map((member, i) => (
				<Member key={i} member={member} />
			))}
		</div>
	);
});

const DEPARTMENTTOCOLOR = {
	marketing: 'green-500',
	industry: 'blue-500',
	dev: 'red-500',
};

function Member({ member }) {
	console.log(
		DEPARTMENTTOCOLOR[member.department.toLowerCase()],
		member.department.toLowerCase()
	);
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
						className={
							'text-' +
							DEPARTMENTTOCOLOR[member.department.toLowerCase()] +
							' font-light'
						}
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
						<div className='font-light text-sm'>
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
							name={'FaLink'}
							className='p-2 rounded-full text-purple-400 hover:scale-105'
						/>
					</a>
				</div>
			</div>
			<hr />
		</div>
	);
}

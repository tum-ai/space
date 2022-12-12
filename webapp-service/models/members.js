import { makeAutoObservable } from 'mobx';

export class MembersModel {
	members = [];
	root;

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);
	}

	getMembers() {
		return this.members;
	}

	findMember(id) {
		return this.members.find((member) => member.id === id);
	}

	setMembers(members) {
		this.members = members;
	}

	// STATE FUNCTIONS

	// API FUNCTIONS
	async fetchMembers() {
		this.members = mockData;
		// try {
		// 	const response = await axios('/members');
		// 	this.setMembers(response.data);
		// } catch (error) {
		// 	alert(error.response?.data?.message);
		// }
	}

	// ONLOAD
	async loadMembers() {
		await this.fetchMembers();
	}
}

var mockData = [
	{
		profileID: '1',
		name: 'Max Mustermann',
		picture:
			'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
		department: 'Industry',
		role: 'member',
		description: 'Hollywood star',
		degreeName: 'Information Systems',
		degreeLevel: 'M.Sc.',
		degreeSemester: '4',
		university: 'TUM',
	},
	{
		profileID: '2',
		name: 'John Smith',
		picture: '',
		department: 'Marketing',
		role: 'member',
		description: 'Hollywood star',
		degreeName: 'Computer Science',
		degreeLevel: 'B.Sc.',
		degreeSemester: '1',
		university: 'TUM',
	},
	{
		profileID: '3',
		name: 'Thomas Schmidt',
		picture: '',
		department: 'Dev',
		role: 'member',
		description: 'Hollywood star',
		degreeName: 'Information Systems',
		degreeLevel: 'M.Sc.',
		degreeSemester: '3',
		university: 'TUM',
	},
	{
		profileID: '4',
		name: 'Thomas Schmidt',
		picture: '',
		department: 'Makeathon',
		role: 'team lead',
		description: 'Hollywood star',
		degreeName: 'Management & Technology',
		degreeLevel: 'M.Sc.',
		degreeSemester: '1',
		university: 'LMU',
	},
	{
		profileID: '5',
		name: 'Jakob',
		picture: '',
		department: 'Marketing',
		role: 'member',
		description: 'Hollywood star',
		degreeName: 'Data Engineering and Analytics',
		degreeLevel: 'M.Sc.',
		degreeSemester: '3',
		university: 'TUM',
	},
	{
		profileID: '6',
		name: 'Matthias Müller',
		picture: '',
		department: 'Community',
		role: 'team lead',
		description: 'Hollywood star',
		degreeName: 'Information Systems',
		degreeLevel: 'B.Sc.',
		degreeSemester: '3',
		university: 'TUM',
	},
	{
		profileID: '7',
		name: 'Lukas Zimmermann',
		picture: '',
		department: 'Dev',
		role: 'member',
		description: 'Hollywood star',
		degreeName: 'Information Systems',
		degreeLevel: 'M.Sc.',
		degreeSemester: '3',
		university: 'TUM',
	},
	{
		profileID: '8',
		name: 'Mo Salah',
		picture: '',
		department: 'Dev',
		role: 'member',
		description: 'Hollywood star',
		degreeName: 'Information Systems',
		degreeLevel: 'M.Sc.',
		degreeSemester: '3',
		university: 'TUM',
	},
	// {
	// 	profileID: '1',
	// 	picture: 'XXXXX',
	// 	department: 'XXXXX',
	// 	role: 'XXXXX',
	// 	description: 'XXXXX',
	// 	degreeName: 'XXXXX',
	// 	degreeLevel: 'XXXXX',
	// 	degreeSemester: 'XXXXX',
	// 	university: 'XXXXX',
	// 	picture: 'XXXXX',
	// },
];

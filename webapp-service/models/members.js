import { makeAutoObservable } from 'mobx';

class Members {
	members = [];

	constructor() {
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
		console.log('mem');
		await this.fetchMembers();
	}
}

const members = new Members();

var mockData = [
	{
		profileID: '1',
		name: 'Max Mustermanns',
		picture:
			'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
		department: 'Industry',
		role: 'member',
		description: 'Hollywood star',
		degreeName: 'Information Systems',
		degreeLevel: 'M.Sc.',
		degreeSemester: '3',
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
		degreeSemester: '3',
		university: 'TUM',
	},
	{
		profileID: '3',
		name: 'Thomas Schmidt',
		picture: '',
		department: 'Industry',
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

export default members;

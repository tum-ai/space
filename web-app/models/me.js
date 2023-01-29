import { makeAutoObservable } from 'mobx';

export class MeModel {
	root;
	profile = {};

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);
	}

	getProfile() {
		return this.profile;
	}

	// STATE FUNCTIONS

	updateProfile(newProfile) {
		this.profile = { ...this.profile, ...newProfile };
	}

	// API FUNCTIONS
	async #fetchProfile() {
		this.profile = mockData;
		// try {
		// 	const response = await axios('/profile');
		// 	this.setMembers(response.data);
		// } catch (error) {
		// 	alert(error.response?.data?.message);
		// }
	}

	// ONLOAD
	async loadProfile() {
		await this.#fetchProfile();
	}
}

var mockData = {
	profileID: '1',
	name: 'Max Mustermann',
	picture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
	department: 'Industry',
	role: 'member',
	description: 'Hollywood star',
	degreeName: 'Information Systems',
	degreeLevel: 'M.Sc.',
	degreeSemester: '4',
	university: 'TUM',
};

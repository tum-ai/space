import { makeAutoObservable } from 'mobx';

export class ProfileModel {
	root;
	profile = {};
	editorProfile = {};
	editorActive = false;

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);
	}

	getProfile() {
		return this.profile;
	}

	// STATE FUNCTIONS

	saveProfile() {
		// TODO: do attribute validations
		this.profile = { ...this.profile, ...this.editorProfile };
		// TODO: call api to edit profile
	}

	updateEditorProfile(newEditorProfile) {
		this.editorProfile = { ...this.editorProfile, ...newEditorProfile };
	}

	toggleEditor() {
		this.editorActive = !this.editorActive;
		if (this.editorActive) {
			this.editorProfile = { ...this.profile };
		}
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
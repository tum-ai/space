import axios from 'axios';
import { makeAutoObservable } from 'mobx';

export class ProfileModel {
	root;
	profile = {};
	editorProfile = {};
	loading = true;
	error = false;
	editorActive = false;

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);
	}

	// STATE FUNCTIONS
	updateEditorProfile(changes) {
		this.editorProfile = { ...this.editorProfile, ...changes };
	}

	toggleEditor() {
		if (this.editorActive) {
			this.editorActive = false;
			this.editorProfile = {};
		} else {
			this.editorActive = true;
			this.editorProfile = { ...this.profile };
		}
	}

	// API FUNCTIONS
	async getProfile(id) {
		try {
			const profile = await ProfileModel.fetchProfile(id);
			this.profile = profile;
			this.loading = false;
			this.error = false;
		} catch (error) {
			this.loading = false;
			this.error =
				error?.response?.data?.message ||
				'An error occured. Could not fetch profile.';
		}
	}

	static async fetchProfile(id) {
		const profile = await axios(id == 'me' ? '/me' : '/profile/' + id);
		return profile?.data?.data;
	}

	async editProfile() {
		try {
			const editResult = await axios('/me', {
				data: this.editorProfile,
				method: 'PATCH',
			});
			this.profile = { ...this.profile, ...editResult.data.data };
		} catch (error) {
			console.log(error);
			console.log('Could not edit profile');
			alert('Could not edit profile');
		}
	}
}

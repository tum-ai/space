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
	async fetchProfile(id) {
		try {
			const profile = await axios(id == 'me' ? 'me' : '/profile/' + id);
			this.profile = profile?.data?.data;
			this.loading = false;
			this.error = false;
		} catch (error) {
			console.log(error?.response?.data?.message);
			this.loading = false;
			this.error =
				error?.response?.data?.message ||
				'An error occured. Could not fetch profile.';
		}
	}

	async editProfile() {
		try {
			const changes = Object.keys(this.editorProfile)
				.filter((key) => this.profile[key] != this.editorProfile[key])
				.reduce((obj, key) => {
					obj[key] = this.editorProfile[key];
					return obj;
				}, {});
			const editResult = await axios('/me', {
				data: this.editorProfile,
				method: 'PATCH',
			});
			this.profile = { ...this.profile, ...editResult.data.data };
			this.toggleEditor();
		} catch (error) {
			console.log(error);
			console.log('Could not edit profile');
			alert('Could not edit profile');
		}
	}
}

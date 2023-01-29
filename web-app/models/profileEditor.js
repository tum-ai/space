import { makeAutoObservable } from 'mobx';

export class ProfileEditorModel {
	root;
	profile = {};
	active = false;

	constructor(root) {
		this.root = root;
		this.active = false;
		makeAutoObservable(this);
	}

	getProfile() {
		return this.profile;
	}

	// STATE FUNCTIONS

	updateProfile(newProfile) {
		this.profile = { ...this.profile, ...newProfile };
	}

	saveProfile() {
		this.root.meModel.updateProfile(this.profile);
	}

	toggle() {
		this.active = !this.active;
		if (this.active) {
			this.profile = { ...this.root.meModel.getProfile() };
		}
	}
}

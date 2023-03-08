import axios from 'axios';
import { makeAutoObservable } from 'mobx';

export class MemberModel {
	root;
	member = {};
	loading = true;
	error = false;

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);
	}

	// API FUNCTIONS
	async fetchMember(id) {
		try {
			const profile = await axios('/profile/' + id);
			this.member = profile.data.data;
			this.loading = false;
			this.error = false;
		} catch (error) {
			console.log('Could not get profile');
			this.loading = false;
			this.error = true;
		}
	}
}

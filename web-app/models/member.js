import axios from 'axios';
import { makeAutoObservable } from 'mobx';

export class MemberModel {
	root;
	member = {};
	editorMember = {};
	loading = true;
	error = false;
	editorActive = false;

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);
	}

	// STATE FUNCTIONS
	updateEditorMember(changes) {
		this.editorMember = { ...this.editorMember, ...changes };
	}

	toggleEditor() {
		if (this.editorActive) {
			this.editorActive = false;
			this.editorMember = {};
		} else {
			this.editorActive = true;
			this.editorMember = { ...this.member };
		}
	}

	// API FUNCTIONS
	async fetchMember(id) {
		try {
			const profile = await axios('/profile/' + (id == 'me' ? '' : id));
			this.member = profile?.data?.data;
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
			const changes = Object.keys(this.editorMember)
				.filter((key) => this.member[key] != this.editorMember[key])
				.reduce((obj, key) => {
					obj[key] = this.editorMember[key];
					return obj;
				}, {});
			const editResult = await axios('/profile/', {
				data: this.editorMember,
				method: 'PATCH',
			});
			this.member = { ...this.member, ...editResult.data.data };
			this.toggleEditor();
		} catch (error) {
			console.log(error);
			console.log('Could not edit profile');
			alert('Could not edit profile');
		}
	}
}

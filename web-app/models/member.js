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
			const profile = await axios('/profile/' + id);
			this.member = profile?.data?.data;
			this.loading = false;
			this.error = false;
		} catch (error) {
			console.log('Could not get profile');
			this.loading = false;
			this.error = true;
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
			const editResult = await axios('/profile/me', {
				data: changes,
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

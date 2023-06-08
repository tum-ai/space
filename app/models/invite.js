import axios from 'axios';
import { makeAutoObservable } from 'mobx';

export class InviteModel {
	root;
	text = '';

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);
	}

	// STATE FUNCTIONS
	updateText(changes) {
		this.editorProfile = { ...this.editorProfile, ...changes };
	}

	formatText() {
		let rows = this.text.split('\n');
		rows = rows.map((row) => {
			const items = row.split(',');
			return {
				email: items[0],
				first_name: items[1],
				last_name: items[2],
				department_handle: items[3],
				department_position: items[4],
			};
		});
		return rows;
	}

	async invite() {
		// TODO
		const formatedText = this.formatText();
		await InviteModel.inviteMembers(formatedText);
	}

	// API FUNCTIONS
	static async inviteMembers(formatedText) {
		const invites = await axios('/profiles/invite/members', {
			method: 'POST',
			data: formatedText,
		});
		return invites.data;
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

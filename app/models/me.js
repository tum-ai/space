import { makeAutoObservable } from 'mobx';

export class MeModel {
	root;
	editorProfile = {};
	loading = true;

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);
	}

	updateEditorProfile(changes) {
		this.editorProfile = { ...this.editorProfile, ...changes };
	}

	async editProfile() {
		const data = await this.root.PATCH('me', this.editorProfile);
		if (data) {
			this.profile = { ...this.profile, ...data };
		}
	}
}

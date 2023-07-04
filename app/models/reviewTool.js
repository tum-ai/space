import { makeAutoObservable } from 'mobx';

export class ReviewToolModel {
	root;
	applications = [];

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);

		this.fetchApplications();
	}

	async fetchApplications() {
		const applications = await this.root.GET('/membership_applications/');
		this.applications = applications;
	}
}

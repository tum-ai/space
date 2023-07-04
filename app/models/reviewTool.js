import { makeAutoObservable } from 'mobx';

export class ReviewToolModel {
	root;
	applications = [];
	filteredApplications = [];
	search = '';

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);

		this.fetchApplications();
	}

	setSearch(value) {
		this.search = value;
		this.filterApplications();
	}

	filterApplications() {
		this.filteredApplications = this.applications.filter((application) => {
			return (
				!this.search ||
				JSON.stringify({ ...application, _id: '' })
					.toLocaleLowerCase()
					.includes(this.search.toLocaleLowerCase())
			);
		});
	}

	async fetchApplications() {
		const applications = await this.root.GET('/membership_applications/');
		this.applications = applications;
		this.filteredApplications = applications;
	}
}

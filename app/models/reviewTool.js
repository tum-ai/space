import { makeAutoObservable } from 'mobx';

export class ReviewToolModel {
	root;
	applications = [];
	filteredApplications = [];
	search = '';
	editorReview = {};
	applicationOnReview = {};
	openTab = 'Applications';

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);

		this.fetchApplications();
	}

	setOpenTab(tab) {
		this.openTab = tab;
	}

	updateEditorReview(change) {
		this.editorReview = { ...this.editorReview, ...change };
	}

	reviewApplication(id) {
		this.applicationOnReview = this.applications.find(
			(application) => application.id == id
		);
		this.setOpenTab('Review');
		console.log('setting');
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
		const applications = await this.root.GET('/applications/');
		this.applications = applications;
		this.filteredApplications = applications;
	}

	async submitReview() {
		const data = await this.root.POST(
			'/review_tool/membership_application_review',
			{ ...this.editorReview, reviewee: this.applicationOnReview?.id }
		);
		if (!data) return;
		if (data?.response_type == 'success') {
			this.root.uiModel.updateModalContent(
				<div className=''>Review submitted successfully</div>
			);
			this.root.uiModel.toggleModal();
			this.editorReview = {};
		}
	}
}

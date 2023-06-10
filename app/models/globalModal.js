import { makeAutoObservable } from 'mobx';

export class GlobalModalModel {
	modalActive = false;
	body;

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);
	}

	// STATE FUNCTIONS
	updateBody(body) {
		this.body = body;
	}

	toggleModal() {
		this.modalActive = !this.modalActive;
		if (!this.modalActive) {
			this.body = undefined;
		}
	}
}

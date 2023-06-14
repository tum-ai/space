import { makeAutoObservable } from 'mobx';

export class UiModel {
	modalActive = false;
	modalContent;

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);
	}

	// STATE FUNCTIONS
	updateModalContent(modalContent) {
		this.modalContent = modalContent;
	}

	toggleModal() {
		this.modalActive = !this.modalActive;
		if (!this.modalActive) {
			this.modalContent = undefined;
		}
	}
}

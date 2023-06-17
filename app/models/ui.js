import { makeAutoObservable } from 'mobx';

export class UiModel {
	modalActive = false;
	navBarActive = false;
	modalContent;

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);
	}

	// STATE FUNCTIONS
	updateModalContent(modalContent) {
		this.modalContent = modalContent;
	}

	setNavBarActive(state) {
		this.navBarActive = state;
	}

	toggleModal() {
		this.modalActive = !this.modalActive;
		if (!this.modalActive) {
			this.modalContent = undefined;
		}
	}
}

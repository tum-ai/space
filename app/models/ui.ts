import { makeAutoObservable } from "mobx";
import { RootModel } from "./root";

export class UiModel {
  root: RootModel;
  modalActive = false;
  navBarActive = false;
  modalContent;

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

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

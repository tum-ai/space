import { makeAutoObservable } from "mobx";
import { RootModel } from "./root";

export class UiModel {
  root: RootModel;
  navBarActive = false;

  constructor(root: RootModel) {
    this.root = root;
    makeAutoObservable(this);
  }

  setNavBarActive(isActive: boolean) {
    this.navBarActive = isActive;
  }
}

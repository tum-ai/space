import { makeAutoObservable } from "mobx";
import { RootModel } from "./root";

export class ProfileModel {
  root: RootModel;
  profile = {};
  loading = true;

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  async getProfile(id: string) {
    const profile = await this.root.GET("/profile/" + id);
    this.profile = profile;
    this.loading = false;
  }
}

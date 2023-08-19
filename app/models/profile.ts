import { makeAutoObservable } from "mobx";

export class ProfileModel {
  root;
  profile = {};
  loading = true;

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  async getProfile(id) {
    const profile = await this.root.GET("/profile/" + id);
    this.profile = profile;
    this.loading = false;
  }
}

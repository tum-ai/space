import { makeAutoObservable } from "mobx";
import { RootModel } from "./root";
import axios from "axios";

export class ProfileModel {
  root: RootModel;
  profile: any = {};
  loading = true;

  constructor(root: RootModel) {
    this.root = root;
    makeAutoObservable(this);
  }

  async getProfile(id: string) {
    const profile = await axios
      .get(`/profile/${id}`)
      .then((res) => res.data.data);

    this.profile = profile;
    this.loading = false;
  }
}

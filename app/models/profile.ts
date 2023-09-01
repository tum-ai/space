import axios, { AxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import { toast } from "react-hot-toast";
import { RootModel } from "./root";

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
      .then((res) => res.data.data)
      .catch((err: AxiosError) => {
        toast.error(`Failed to get profile: ${err.message}`);
      });

    this.profile = profile;
    this.loading = false;
  }
}

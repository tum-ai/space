import axios, { AxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import { toast } from "react-hot-toast";
import { RootModel } from "./root";

export interface SocialNetwork {
  link: string; // URL
  type: string;
}

export interface Profile {
  first_name: string;
  last_name: string;
  description: string;
  profile_picture: string;
  socialNetworks: SocialNetwork[];
  department: string;
  previousDepartments: string[];
  degree_level: string; // TODO: this should probably be it's own type
  degree_name: string;
  degree_semester: string;
  currentJob: string; // TODO: why is this camel case
  university: string;
  nationality: string;
}

export class ProfileModel {
  root: RootModel;
  profile: Profile;
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

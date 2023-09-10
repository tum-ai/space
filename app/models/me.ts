// @ts-nocheck
import { auth } from "@config/firebase";
import axios, { AxiosError } from "axios";
import { signOut } from "firebase/auth";
import { makeAutoObservable } from "mobx";
import { toast } from "react-hot-toast";
import { RootModel } from "./root";

export class MeModel {
  root: RootModel;
  editorProfile: any = {};
  user = undefined;
  credentials: { email: string; password: string } = {
    email: "",
    password: "",
  };
  resetEmail: string = "";

  constructor(root: RootModel) {
    this.root = root;
    makeAutoObservable(this);
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        axios.defaults.headers = {
          authorization: `bearer ${user.accessToken}`,
        };
        const profile = (await axios("/me")).data.data;
        const roles = (await axios("/me/role/holderships")).data.data;
        profile["role_holderships"] = roles.map((obj) => obj["role"]);
        this.setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          profile: { ...profile },
        });
        // fetch stuff that you are authorized for
        if (
          profile["role_holderships"].find((role) => role["handle"] == "admin")
        ) {
          this.root.rolesModel.getRoles();
          this.root.rolesModel.getRoleHolderships();
          this.root.departmentMembershipsModel.fetchDepartments();
        }
      } else {
        this.setUser(null);
      }
    });
  }

  setCredentials(credentials: { email: string; password: string }) {
    this.credentials = credentials;
  }

  setResetEmail(resetEmail: string) {
    this.resetEmail = resetEmail;
  }

  updateEditorProfile(changes) {
    this.editorProfile = { ...this.editorProfile, ...changes };
  }

  setUser(user) {
    this.user = user;
  }

  hasRoles(user, roles) {
    if (roles?.length == 0 || !user) {
      return false;
    }
    if (!roles) {
      return true;
    }
    const user_roles = user.profile.role_holderships.map((obj) => obj.handle);
    const intersection = user_roles.filter((value) => roles.includes(value));
    return intersection.length > 0;
  }

  // Api

  async sendPasswordResetLink() {
    await axios
      .post("/resetPassword?email=" + this.resetEmail)
      .then(() => {
        toast.success(`Password reset link sent.`);
      })
      .catch((err: AxiosError) => {
        toast.error(`Failed to get my profile: ${err.message}`);
      });
  }

  async logout() {
    const value = await signOut(auth)
      .then((res) => {
        return true;
      })
      .catch((err: AxiosError) => {
        toast.error(`Failed to get my roles: ${err.message}`);
      });
    if (value) {
      this.setUser(null);
    }
  }

  async getProfile() {
    const profile = await axios("/me")
      .then((res) => res.data.data)
      .catch((err: AxiosError) => {
        toast.error(`Failed to get my profile: ${err.message}`);
      });
    const roles = await axios("/me/role/holderships")
      .then((res) => res.data.data)
      .catch((err: AxiosError) => {
        toast.error(`Failed to get my roles: ${err.message}`);
      });
    if (profile && roles) {
      profile["role_holderships"] = roles.map((obj) => obj["role"]);
      this.setUser({
        uid: this.user.uid,
        email: this.user.email,
        displayName: this.user.displayName,
        profile: { ...profile },
      });
    }
  }

  async editProfile() {
    const data = await axios
      .patch("me", {
        data: this.editorProfile,
      })
      .then((res) => res.data.data)
      .catch((err: AxiosError) => {
        toast.error(`Failed to edit: ${err.message}`);
      });

    if (data) {
      toast.success("Successfully edited profile.");
      this.profile = { ...this.profile, ...data };
    }
  }
}

// @ts-nocheck
import { auth } from "@config/firebase";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { makeAutoObservable } from "mobx";
import { RootModel } from "./root";

export class MeModel {
  root: RootModel;
  editorProfile: any = {};
  user = undefined;
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
        this.root.rolesModel.getRoles();
        this.root.rolesModel.getRoleHolderships();
        this.root.departmentMembershipsModel.fetchDepartments();
        this.root.reviewToolModel.fetchApplications();
        this.root.reviewToolModel.fetchMyreviews();
        this.root.referralsModel.fetchReferrals();
      } else {
        this.setUser(null);
      }
    });
  }

  updateEditorProfile(changes) {
    this.editorProfile = { ...this.editorProfile, ...changes };
  }

  setUser(user) {
    this.user = user;
  }

  async logout() {
    this.setUser(null);
    await signOut(auth);
  }

  signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async getProfile() {
    const profile = (await axios("/me")).data.data;
    const roles = (await axios("/me/role/holderships")).data.data;
    profile["role_holderships"] = roles.map((obj) => obj["role"]);
    this.setUser({
      uid: this.user.uid,
      email: this.user.email,
      displayName: this.user.displayName,
      profile: { ...profile },
    });
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

  async editProfile() {
    const data = await this.root.PATCH("me", this.editorProfile);
    if (data) {
      this.profile = { ...this.profile, ...data };
    }
  }
}

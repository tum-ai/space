import { makeAutoObservable } from "mobx";
import { RootModel } from "./root";

export class ReferralsModel {
  root: RootModel;
  referrals: [] = [];
  referral: {
    email: string;
    first_name: string;
    last_name: string;
    comment: string;
  } = {
    email: "",
    first_name: "",
    last_name: "",
    comment: "",
  };

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  setReferralAttribute(
    name: "email" | "first_name" | "last_name" | "comment",
    value: string,
  ) {
    this.referral[name] = value;
  }

  //   API

  async submitRefrral() {}
}

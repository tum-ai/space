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

  /**
   * Submits referral in current state
   */
  async submitRefrral() {
    const data = await this.root.POST("/applications/referral/", {
      ...this.referral,
    });
    if (!data) return;
    if (data?.response_type == "success") {
      // TODO: toast
    }
  }

  /**
   * Fetches referrals.
   */
  async fetchReferrals() {
    const referrals = await this.root.GET("/applications/referrals/");
    this.referrals = referrals;
  }
}

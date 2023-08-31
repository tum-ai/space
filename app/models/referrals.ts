import { makeAutoObservable } from "mobx";
import { RootModel } from "./root";

export class ReferralsModel {
  root: RootModel;
  referrals: {
    email: string;
    first_name: string;
    last_name: string;
    comment: string;
  }[] = [];
  referral: {
    email: string;
    first_name: string;
    last_name: string;
    comment: string;
  } = {
    email: null,
    first_name: null,
    last_name: null,
    comment: null,
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
    const data = await this.root.POST("/application/referral/", {
      ...this.referral,
    });
    if (!data) return;
    if (data?.response_type == "success") {
      this.fetchReferrals();
      this.referral = {
        email: null,
        first_name: null,
        last_name: null,
        comment: null,
      };
    }
  }

  /**
   * Fetches referrals.
   */
  async fetchReferrals() {
    const referrals = await this.root.GET("/application/referrals/");
    this.referrals = referrals;
  }

  /**
   * Deletes the referral associated with the current user and the email.
   *
   * @param email - The email of the person you referred.
   */
  async deleteReferral(email: string) {
    await this.root.DELETE("/application/referral/?email=" + email);
    this.fetchReferrals();
  }
}

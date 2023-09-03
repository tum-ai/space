import axios, { AxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import toast from "react-hot-toast";
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
    await axios
      .post("/application/referral/", {
        data: { ...this.referral },
      })
      .then(() => {
        this.fetchReferrals();
        this.referral = {
          email: null,
          first_name: null,
          last_name: null,
          comment: null,
        };
      })
      .catch((err: AxiosError) => {
        toast.error(`Failed to submit referral: ${err.message}`);
      });
  }

  /**
   * Fetches referrals.
   */
  async fetchReferrals() {
    const referrals = await axios
      .get("/application/referrals/")
      .then((res) => {
        const referrals = res.data.data;
        this.referrals = referrals;
      })
      .catch((err: AxiosError) => {
        toast.error(`Failed to get referrals: ${err.message}`);
      });
  }

  /**
   * Deletes the referral associated with the current user and the email.
   *
   * @param email - The email of the person you referred.
   */
  async deleteReferral(email: string) {
    const value = await axios
      .delete("/application/referral/?email=" + email)
      .then((res) => true)
      .catch((err: AxiosError) => {
        toast.error(`Failed to delete referral for ${email}: ${err.message}`);
      });
    if (value) {
      this.fetchReferrals();
    }
  }
}

import axios, { AxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import toast from "react-hot-toast";
import { RootModel } from "./root";

export class ReviewToolModel {
  root: RootModel;
  applications: any[] = [];
  filteredApplications: any[] = [];
  search: string = "";
  editorReview: any = {};
  applicationOnReview: { id?: string };
  openTab: "Applications" | "Review" = "Applications";
  myreviews: any[] = [];
  filter: { [key: string]: any } = {};
  formType: "MEMBERSHIP" | "VENTURE" = "MEMBERSHIP";

  constructor(root: RootModel) {
    this.root = root;
    makeAutoObservable(this);
  }

  setOpenTab(tab) {
    this.openTab = tab;
  }

  setSearch(value) {
    this.search = value;
    this.filterApplications();
  }

  updateEditorReview(change) {
    this.editorReview = { ...this.editorReview, ...change };
  }

  reviewApplication(id) {
    this.applicationOnReview = this.applications.find(
      (application) => application.id == id,
    );
    this.setOpenTab("Review");
  }

  #findProp(obj, prop, defval) {
    if (typeof defval == "undefined") defval = null;
    prop = prop.split(".");
    for (var i = 0; i < prop.length; i++) {
      if (typeof obj[prop[i]] == "undefined") return defval;
      obj = obj[prop[i]];
    }
    return obj;
  }

  setFilter(key, value) {
    if (!value) {
      delete this.filter[key];
    } else {
      this.filter[key] = value;
    }
    this.filterApplications();
  }

  resetFilters() {
    this.filter = {};
    this.filterApplications();
  }

  getFormNames() {
    return [
      ...new Set(
        this.applications.map((application) => {
          return application.submission?.data?.formName;
        }),
      ),
    ];
  }

  setFormType(formType: string) {
    this.formType = formType as any;
  }

  // Api

  /**
   * Filters applications in the current state according to the filters and search states.
   */
  filterApplications() {
    this.filteredApplications = this.applications.filter((application) => {
      for (const key in this.filter) {
        if (
          this.filter[key] &&
          this.#findProp(application, key, "") != this.filter[key]
        ) {
          return false;
        }
      }
      return (
        !this.search ||
        JSON.stringify({ ...application, _id: "" })
          .toLocaleLowerCase()
          .includes(this.search.toLocaleLowerCase())
      );
    });
    this.sortApplications();
  }

  /**
   * Sorts applications stored in the current state according to their final score from highest to lowest.
   */
  sortApplications() {
    this.filteredApplications = this.filteredApplications.sort((a, b): any => {
      const finalScoresA = a.reviews.map((review) => review.finalscore);
      const finalScoresB = b.reviews.map((review) => review.finalscore);
      const sumA = finalScoresA.reduce((a, b) => a + b, 0);
      const avgA = sumA / finalScoresA.length || 0;
      const sumB = finalScoresB.reduce((a, b) => a + b, 0);
      const avgB = sumB / finalScoresB.length || 0;
      return avgB - avgA;
    });
  }

  // API

  /**
   * Fetches applications from api and saves them in the state.
   */
  async fetchApplications() {
    const applications = await axios
      .get("/applications/")
      .then((res) => res.data.data)
      .catch((err: AxiosError) => {
        toast.error(`Failed to get applications: ${err.message}`);
      });

    if (applications) {
      this.applications = applications;
      this.filteredApplications = applications;
      this.sortApplications();
    }
  }

  /**
   * Fetches the reviews of the current user and saves them in the state.
   */
  async fetchMyreviews() {
    const myreviews = await axios
      .get("/review_tool/myreviews/")
      .then((res) => res.data.data)
      .catch((err: AxiosError) => {
        toast.error(`Failed to get my reviews: ${err.message}`);
      });
    if (myreviews) {
      this.myreviews = myreviews;
    }
  }

  /**
   * Deletes the review associated with the current user and the application_id.
   *
   * @param application_id - The ID of the application
   */
  async deleteReview(application_id) {
    const value = await axios
      .delete("/review_tool/delete_review/?reviewee_id=" + application_id)
      .then((res) => {
        return true;
      })
      .catch((err: AxiosError) => {
        toast.error(
          `Failed to delete review for application ${application_id}: ${err.message}`,
        );
      });
    if (value) {
      this.fetchMyreviews();
      this.fetchApplications();
    }
  }

  /**
   * Submits a review stored in the current state (editorReview).
   */
  async submitReview(review: any) {
    const value = await axios
      .post("/review_tool/application_review", {
        data: {
          form: review,
          review_type: this.formType,
          reviewee_id: this.applicationOnReview?.id,
        },
      })
      .then((res) => {
        return true;
      })
      .catch((err: AxiosError) => {
        toast.error(
          `Failed to submit review for application ${this.applicationOnReview?.id}: ${err.message}`,
        );
      });

    if (value) {
      toast.success("Submitted review");
      this.editorReview = {};
      this.applicationOnReview = {};
      this.openTab = "Applications";
      this.fetchMyreviews();
      this.fetchApplications();
    }
  }

  /**
   * Deletes the application associated with the id.
   *
   * @param id - The ID of the application
   */
  async deleteApplication(id) {
    const value = await axios
      .delete("/applications/delete_application/?id=" + id)
      .then(() => {
        return true;
      })
      .catch((err: AxiosError) => {
        toast.error(
          `Failed to delete review for application ${id}: ${err.message}`,
        );
      });
    if (value) {
      this.fetchMyreviews();
      await this.fetchApplications();
      this.filterApplications();
    }
  }
}

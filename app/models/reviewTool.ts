import { makeAutoObservable } from "mobx";
import { RootModel } from "./root";
import axios from "axios";
import toast from "react-hot-toast";

export class ReviewToolModel {
  root: RootModel;
  applications: any[] = [];
  filteredApplications: any[] = [];
  search: string = "";
  editorReview: any = {};
  applicationOnReview: { id?: string };
  openTab: "Applications" | "Review" = "Applications";
  myreviews: any[] = [];

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

  /**
   * Filters applications in the current state according to the filters and search states.
   */
  filterApplications() {
    this.filteredApplications = this.applications.filter((application) => {
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
      .catch((err) => {
        console.error(err);
        toast.error(err);
      });

    this.applications = applications;
    this.filteredApplications = applications;
    this.sortApplications();
  }

  /**
   * Fetches the reviews of the current user and saves them in the state.
   */
  async fetchMyreviews() {
    const myreviews = await this.root.GET("/review_tool/myreviews/");
    this.myreviews = myreviews;
  }

  /**
   * Deletes the review associated with the current user and the application_id.
   *
   * @param application_id - The ID of the application
   */
  async deleteReview(application_id) {
    await this.root.DELETE(
      "/review_tool/delete_review/?reviewee_id=" + application_id,
    );
    this.fetchMyreviews();
    this.fetchApplications();
  }

  /**
   * Submits a review stored in the current state (editorReview).
   */
  async submitReview() {
    const data = await axios
      .post("/review_tool/application_review", {
        data: {
          data: {
            ...this.editorReview,
            reviewee_id: this.applicationOnReview?.id,
          },
        },
      })
      .catch((err) => {
        toast.error("Failed");
        console.error(err);
      });

    if (!data) return;

    toast.success("Submitted review");
    this.editorReview = {};
    this.applicationOnReview = {};
    this.openTab = "Applications";
    this.fetchMyreviews();
    this.fetchApplications();
  }
}

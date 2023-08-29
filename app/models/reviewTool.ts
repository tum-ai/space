import { makeAutoObservable } from "mobx";
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

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  setViewApplication(viewApplication) {
    this.viewApplication = viewApplication;
  }

  setViewReview(viewReview) {
    this.viewReview = viewReview;
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
    const applications = await this.root.GET("/applications/");
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
    const data = await this.root.POST("/review_tool/application_review", {
      ...this.editorReview,
      reviewee_id: this.applicationOnReview?.id,
    });
    if (!data) return;
    if (data?.response_type == "success") {
      // TODO: toast
      this.editorReview = {};
      this.applicationOnReview = {};
      this.openTab = "Applications";
    }
    this.applicationOnReview = {};
    this.fetchMyreviews();
    this.fetchApplications();
  }
}

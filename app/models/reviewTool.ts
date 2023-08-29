import { makeAutoObservable } from "mobx";
import { RootModel } from "./root";
import axios from "axios";
import toast from "react-hot-toast";

export class ReviewToolModel {
  root: RootModel;
  applications = [];
  filteredApplications = [];
  search = "";
  editorReview: any = {};
  applicationOnReview: { id?: string };
  openTab = "Applications";
  viewApplication = undefined;
  viewReview = undefined;

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

  updateEditorReview(change) {
    this.editorReview = { ...this.editorReview, ...change };
  }

  reviewApplication(id) {
    this.applicationOnReview = this.applications.find(
      (application) => application.id == id,
    );
    this.setOpenTab("Review");
    console.log("setting");
  }

  setSearch(value) {
    this.search = value;
    this.filterApplications();
  }

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

  async fetchApplications() {
    const applications = await this.root.GET("/applications/");
    this.applications = applications;
    this.filteredApplications = applications;
    this.sortApplications();
  }

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
  }
}

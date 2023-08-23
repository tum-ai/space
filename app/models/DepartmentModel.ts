import axios from "axios";
import { makeAutoObservable } from "mobx";
import { RootModel } from "./root";

export class DepartmentModel {
  root: RootModel;
  editorProfile = {};
  user = undefined;
  profile;

  constructor(root: RootModel) {
    this.root = root;
    makeAutoObservable(this);
  }

  updateEditorProfile(changes) {
    this.editorProfile = { ...this.editorProfile, ...changes };
  }

  async getDepartmentsByUserId(id) {
    const data = (await axios(`/department/user/${id}`)).data.data;
    data.filter((department) => department.profile_id === id);
    return data;
  }
  async getDepartmentsList() {
    const data = (await axios("/department")).data.data;
    return data;
  }

  async editDepartments() {
    const data = await this.root.PATCH("department", this.editorProfile);
    if (data) {
      this.profile = { ...this.profile, ...data };
    }
  }
}

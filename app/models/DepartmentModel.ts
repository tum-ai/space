import axios from "axios";
import { makeAutoObservable } from "mobx";
import { RootModel } from "./root";
import toast from "react-hot-toast";

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
    const data = await axios
      .patch("department", {
        data: this.editorProfile,
      })
      .then((data) => data.data)
      .catch((err) => toast.error(err));
    if (data) {
      this.profile = { ...this.profile, ...data };
    }
  }
}

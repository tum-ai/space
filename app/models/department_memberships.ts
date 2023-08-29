import { makeAutoObservable } from "mobx";
import { RootModel } from "./root";
import toast from "react-hot-toast";
import axios from "axios";

export class DepartmentMembershipsModel {
  root: RootModel;
  departments = [];
  roles = [];

  constructor(root: RootModel) {
    this.root = root;
    makeAutoObservable(this);
  }

  setDepartments(departments: any[]) {
    this.departments = departments;
  }

  handleSelect(item, index, type) {
    const updatedSelectedOptions = [...this.departments];
    updatedSelectedOptions[index][type] = item.value;
    this.setDepartments(updatedSelectedOptions);
  }

  handleListItemChange(event, index) {
    const { name, value } = event.target;
    const updatedProfile = this.departments.map((item, i) => {
      return i === index ? { ...item, [name]: value } : item;
    });
    this.setDepartments(updatedProfile);
  }

  handleRemoveDepartment(id) {
    this.setDepartments(
      this.departments.filter((department, _) => department.id !== id),
    );
  }

  handleAddDepartment(profile_id) {
    const newDepartmentMembership = {
      profile_id: profile_id,
      department_handle: "",
      position: "",
      time_from: "2023-07-13T12:24:47.322994",
      time_to: "2023-07-13T12:24:47.322995",
      new: true,
    };
    if (this.departments.length === 0) {
      this.setDepartments([newDepartmentMembership]);
      return;
    }
    this.setDepartments([...this.departments, { ...newDepartmentMembership }]);
  }

  async fetchDepartments() {
    const data = await axios
      .get("/department-memberships")
      .then((res) => res.data)
      .catch((err) => {
        toast.error(err);
      });

    if (!data) return;

    // TODO: is this still doing what it is supposed to do?
    data.forEach((item) => {
      item.department_handle = item.department.handle;
      item.position = item.position.replace("PositionType.", "");
      item.profile_id = item.profile.id;
      delete item.profile;
      delete item.department;
    });

    this.setDepartments(data);
  }

  /**
   * Updates the departments on the server with the current ones in the model
   * @returns whether the departments were updated
   */
  async saveDepartments(): Promise<boolean> {
    const data = await axios
      .post("/department-memberships", {
        data: {
          data: this.departments
            .filter((department) => department["new"])
            .map((department) => ({
              ...department,
              new: null,
            })),
        },
      })
      .catch((err) => toast.error(err));

    if (!data) {
      toast.error("received no data");
      return false;
    }

    this.departments = this.departments.map((department) => ({
      ...department,
      new: null,
    }));

    // TODO: this modal state should be handled where this function is called depending on this functions return value
    this.root.uiModel.toggleModal();

    return true;
  }

  async deleteDepartmentMembership(id) {
    await axios.delete("/department-memberships", {
      data: [id],
    });
  }
}

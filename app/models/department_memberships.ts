import axios, { AxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import toast from "react-hot-toast";
import { RootModel } from "./root";

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
    updatedSelectedOptions[index][type] = item;
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
      .then((res) => res.data.data)
      .catch((err: AxiosError) => {
        toast.error(`Failed to get department memberships: ${err.message}`);
      });

    // TODO: is this still doing what it is supposed to do?
    if (data) {
      data.forEach((item) => {
        item.department_handle = item.department.handle;
        item.position = item.position.replace("PositionType.", "");
        item.profile_id = item.profile.id;
        delete item.profile;
        delete item.department;
      });
      this.setDepartments(data);
    }
  }

  /**
   * TODO: Update tsdoc here and explain what is happening
   * Updates the departments on the server with the current ones in the model
   * @returns whether the departments were updated
   */
  async saveDepartments() {
    const departments = this.departments
      .filter((department) => department["new"])
      .map((department) => ({
        ...department,
        new: null,
      }));

    const data = await axios
      .post("/department-memberships", {
        data: departments,
      })
      .then((res) => res.data)
      .catch((err: AxiosError) => {
        toast.error(`Failed to save department memberships: ${err.message}`);
      });

    if (data) {
      this.departments = this.departments.map((department) => ({
        ...department,
        new: null,
      }));

      // TODO: this modal state should be handled where this function is called depending on this functions return value
      this.root.uiModel.toggleModal();
    }
  }

  async deleteDepartmentMembership(id) {
    const value = await axios
      .delete("/department-memberships", {
        data: [id],
      })
      .then((res) => true)
      .catch((err: AxiosError) => {
        toast.error(`Failed to delete department memberships: ${err.message}`);
      });

    if (value) {
      toast.success(`Deleted department membership with ID ${id}`);
    }
  }
}

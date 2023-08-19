import { makeAutoObservable } from "mobx";

export class DepartmentMembershipsModel {
  root;
  departments = [];
  roles = [];

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  setDepartments(departments) {
    this.departments = departments;
  }

  handleSelect(item, index, type) {
    const updatedSelectedOptions = [...this.departments];
    updatedSelectedOptions[index][type] = item.key;
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
    const data = await this.root.GET("/department-memberships");
    if (data) {
      data.map((item) => {
        item.department_handle = item.department.handle;
        item.position = item.position.replace("PositionType.", "");
        item.profile_id = item.profile.id;
        delete item.profile;
        delete item.department;
      });
      this.setDepartments(data);
    }
  }

  async saveDepartments() {
    const data = await this.root.POST(
      "/department-memberships",
      this.departments
        .filter((department) => department["new"])
        .map((department) => ({
          ...department,
          new: null,
        })),
    );
    if (data) {
      this.departments = this.departments.map((department) => ({
        ...department,
        new: null,
      }));
      this.root.uiModel.toggleModal();
    }
  }

  async deleteDepartmentMembership(id) {
    await this.root.DELETE("/department-memberships", [id]);
  }
}

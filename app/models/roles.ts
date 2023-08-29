import axios from "axios";
import { makeAutoObservable } from "mobx";
import toast from "react-hot-toast";

export class RolesModel {
  root;
  roleHolderships = [];
  roles = [];
  profile;

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  setProfileRoles(profileId, roles) {
    this.roleHolderships[profileId] = roles;
  }

  async getRoleHolderships() {
    const roleHolderships = await axios
      .get("/role/holderships")
      .then((res) => res.data.data);

    if (!roleHolderships) return;
    let rolesObject = [];
    for (let i = 0; i < roleHolderships.length; i++) {
      const roleHoldership = roleHolderships[i];
      if (!rolesObject[roleHoldership["profile"]["id"]]) {
        rolesObject[roleHoldership["profile"]["id"]] = [];
      }
      rolesObject[roleHoldership["profile"]["id"]].push(
        roleHoldership["role"]["handle"],
      );
    }
    this.roleHolderships = rolesObject;
  }

  async getRoles() {
    const roles = await axios.get("/roles").then((res) => res.data.data);
    this.roles = roles;
  }

  async updateRoles(roles) {
    const data = await axios
      .patch("/role/holderships", {
        data: roles,
      })
      .then((res) => res.data);

    this.profile = { ...this.profile, ...data };
  }
}

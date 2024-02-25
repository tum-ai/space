import axios, { AxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import { toast } from "sonner";
import { RootModel } from "./root";

export class RolesModel {
  root: RootModel;
  roleHolderships = [];
  roles = [];
  profile;

  constructor(root: RootModel) {
    this.root = root;
    makeAutoObservable(this);
  }

  setProfileRoles(profileId, roles) {
    this.roleHolderships[profileId] = roles;
  }

  async getRoleHolderships() {
    const roleHolderships = await axios
      .get("/role/holderships")
      .then((res) => res.data.data)
      .catch((err: AxiosError) => {
        toast.error(`Failed to get role holderships: ${err.message}`);
      });

    if (roleHolderships) {
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
  }

  async getRoles() {
    const roles = await axios
      .get("/roles")
      .then((res) => res.data.data)
      .catch((err: AxiosError) => {
        toast.error(`Failed to get roles: ${err.message}`);
      });
    if (roles) {
      this.roles = roles;
    }
  }

  async updateRoles(roles) {
    const data = await axios
      .patch("/role/holderships", {
        data: roles,
      })
      .then((res) => res.data.data)
      .catch((err: AxiosError) => {
        toast.error(`Failed to update roles: ${err.message}`);
      });
    if (data) {
      this.profile = { ...this.profile, ...data };
    }
  }
}

// check if this is needed

import { DepartmentMembershipsModel } from "./department_memberships";
import { MeModel } from "./me";
import { RolesModel } from "./roles";

export class RootModel {
  meModel: MeModel;
  rolesModel: RolesModel;
  departmentMembershipsModel: DepartmentMembershipsModel;

  constructor() {
    this.meModel = new MeModel(this);
    this.rolesModel = new RolesModel(this);
    this.departmentMembershipsModel = new DepartmentMembershipsModel(this);
  }
}

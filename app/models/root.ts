import { DepartmentMembershipsModel } from "./department_memberships";
import { MeModel } from "./me";
import { ReviewToolModel } from "./reviewTool";
import { RolesModel } from "./roles";

export class RootModel {
  meModel: MeModel;
  rolesModel: RolesModel;
  departmentMembershipsModel: DepartmentMembershipsModel;
  reviewToolModel: ReviewToolModel;

  constructor() {
    this.meModel = new MeModel(this);
    this.rolesModel = new RolesModel(this);
    this.departmentMembershipsModel = new DepartmentMembershipsModel(this);
    this.reviewToolModel = new ReviewToolModel(this);
  }
}

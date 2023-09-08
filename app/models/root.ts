import { DepartmentMembershipsModel } from "./department_memberships";
import { MeModel } from "./me";
import { ProfileModel } from "./profile";
import { ProfilesModel } from "./profiles";
import { ReferralsModel } from "./referrals";
import { ReviewToolModel } from "./reviewTool";
import { RolesModel } from "./roles";

export class RootModel {
  profileModel: ProfileModel;
  profilesModel: ProfilesModel;
  meModel: MeModel;
  rolesModel: RolesModel;
  departmentMembershipsModel: DepartmentMembershipsModel;
  reviewToolModel: ReviewToolModel;
  referralsModel: ReferralsModel;

  constructor() {
    this.profileModel = new ProfileModel(this);
    this.profilesModel = new ProfilesModel(this);
    this.meModel = new MeModel(this);
    this.rolesModel = new RolesModel(this);
    this.departmentMembershipsModel = new DepartmentMembershipsModel(this);
    this.reviewToolModel = new ReviewToolModel(this);
  }
}

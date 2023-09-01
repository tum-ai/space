import { CertificateModel } from "./certificate";
import { DepartmentMembershipsModel } from "./department_memberships";
import { MeModel } from "./me";
import { ProfileModel } from "./profile";
import { ProfilesModel } from "./profiles";
import { ReviewToolModel } from "./reviewTool";
import { RolesModel } from "./roles";
import { UiModel } from "./ui";

export class RootModel {
  profileModel: ProfileModel;
  profilesModel: ProfilesModel;
  uiModel: UiModel;
  meModel: MeModel;
  rolesModel: RolesModel;
  certificateModel: CertificateModel;
  departmentMembershipsModel: DepartmentMembershipsModel;
  reviewToolModel: ReviewToolModel;

  constructor() {
    this.profileModel = new ProfileModel(this);
    this.profilesModel = new ProfilesModel(this);
    this.uiModel = new UiModel(this);
    this.meModel = new MeModel(this);
    this.rolesModel = new RolesModel(this);
    this.certificateModel = new CertificateModel(this);
    this.departmentMembershipsModel = new DepartmentMembershipsModel(this);
    this.reviewToolModel = new ReviewToolModel(this);
  }
}

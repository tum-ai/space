import { CertificateModel } from "./certificate";
import { DepartmentMembershipsModel } from "./department_memberships";
import { MeModel } from "./me";
import { ReferralsModel } from "./referrals";
import { ReviewToolModel } from "./reviewTool";
import { RolesModel } from "./roles";

export class RootModel {
  meModel: MeModel;
  rolesModel: RolesModel;
  certificateModel: CertificateModel;
  departmentMembershipsModel: DepartmentMembershipsModel;
  reviewToolModel: ReviewToolModel;
  referralsModel: ReferralsModel;

  constructor() {
    this.meModel = new MeModel(this);
    this.rolesModel = new RolesModel(this);
    this.certificateModel = new CertificateModel(this);
    this.departmentMembershipsModel = new DepartmentMembershipsModel(this);
    this.reviewToolModel = new ReviewToolModel(this);
    this.referralsModel = new ReferralsModel(this);
  }
}

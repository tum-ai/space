import axios from "axios";
import { CertificateModel } from "./certificate.js";
import { DepartmentMembershipsModel } from "./department_memberships.js";
import { InviteModel } from "./invite.js";
import { MeModel } from "./me.js";
import { ProfileModel } from "./profile.js";
import { ProfilesModel } from "./profiles.js";
import { ReviewToolModel } from "./reviewTool.js";
import { RolesModel } from "./roles.js";
import { UiModel } from "./ui.js";

export class RootModel {
  profileModel: ProfileModel;
  profilesModel: ProfilesModel;
  inviteModel: InviteModel;
  uiModel: UiModel;
  meModel: MeModel;
  rolesModel: RolesModel;
  certificateModel: CertificateModel;
  departmentMembershipsModel: DepartmentMembershipsModel;
  reviewToolModel: ReviewToolModel;

  constructor() {
    this.profileModel = new ProfileModel(this);
    this.profilesModel = new ProfilesModel(this);
    this.inviteModel = new InviteModel(this);
    this.uiModel = new UiModel(this);
    this.meModel = new MeModel(this);
    this.rolesModel = new RolesModel(this);
    this.certificateModel = new CertificateModel(this);
    this.departmentMembershipsModel = new DepartmentMembershipsModel(this);
    this.reviewToolModel = new ReviewToolModel(this);
  }

  async GET(path: string) {
    try {
      const response = await axios(path);
      return response?.data?.data;
    } catch (error) {
      console.log(error);
    }
  }

  async PATCH(path: string, data: any) {
    try {
      const response = await axios(path, {
        data: { data: data },
        method: "PATCH",
      });
      return response?.data.data;
    } catch (error) {
      console.log(error);
    }
  }

  async DELETE(path: string, data: any) {
    try {
      const response = await axios(path, {
        data: data,
        method: "DELETE",
      });
      return response?.data.data;
    } catch (error) {
      console.log(error);
    }
  }

  async POST(
    path: string,
    data: any,
    config?: { [key: string]: any },
    returnResponse?: boolean,
  ) {
    try {
      const response = await axios(path, {
        data: { data: data },
        method: "POST",
        ...config,
      });
      if (returnResponse) {
        return response;
      }
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  }
}

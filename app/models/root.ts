import axios from "axios";
import { CertificateModel } from "./certificate";
import { DepartmentMembershipsModel } from "./department_memberships";
import { InviteModel } from "./invite";
import { MeModel } from "./me";
import { ProfileModel } from "./profile";
import { ProfilesModel } from "./profiles";
import { ReviewToolModel } from "./reviewTool";
import { RolesModel } from "./roles";
import { UiModel } from "./ui";
import toast from "react-hot-toast";

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

  /**
   * @deprecated use axios.get
   */
  async GET(path: string) {
    try {
      const response = await axios(path);
      return response?.data?.data;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @deprecated use axios.patch
   */
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

  /**
   * @deprecated use axios.delete
   */
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

  /**
   * @deprecated use axios.post
   */
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
      toast.error(error);
    }
  }
}

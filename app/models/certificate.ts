import axios, { AxiosError } from "axios";
import download from "downloadjs";
import { makeAutoObservable } from "mobx";
import toast from "react-hot-toast";
import { RootModel } from "./root";

export class CertificateModel {
  root: RootModel;
  editorCertificate = {};

  constructor(root: RootModel) {
    this.root = root;
    makeAutoObservable(this);
  }

  updateEditorCertificate(changes: any) {
    this.editorCertificate = { ...this.editorCertificate, ...changes };
  }

  async generateCertificate() {
    const response = await axios
      .post("/certificate/membership/", {
        data: { ...this.editorCertificate },
        responseType: "blob",
      })
      .then((res) => res)
      .catch((err: AxiosError) => {
        toast.error(`Failed to generate certificate: ${err.message}`);
      });

    if (response) {
      let fileName = `tumai-certificate-${this.editorCertificate["NAME"]}-${this.editorCertificate["LASTNAME"]}.pdf`;
      download(response.data, fileName, response.headers["content-type"]);
    }
  }
}

import download from "downloadjs";
import { makeAutoObservable } from "mobx";
import { RootModel } from "./root";
import axios from "axios";
import toast from "react-hot-toast";

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
        data: { data: this.editorCertificate },
        responseType: "blob",
      })
      .then((res) => res.data)
      .catch((err) => toast.error(err));

    let fileName = `tumai-certificate-${this.editorCertificate["NAME"]}-${this.editorCertificate["LASTNAME"]}.pdf`;
    download(response.data, fileName, response.headers["content-type"]);
  }
}

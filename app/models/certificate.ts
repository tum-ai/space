import download from "downloadjs";
import { makeAutoObservable } from "mobx";
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
    const response = await this.root.POST(
      "/certificate/membership/",
      this.editorCertificate,
      { responseType: "blob" },
      true,
    );
    let fileName = `tumai-certificate-${this.editorCertificate["NAME"]}-${this.editorCertificate["LASTNAME"]}.pdf`;
    download(response.data, fileName, response.headers["content-type"]);
  }
}

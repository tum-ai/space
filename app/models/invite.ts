import { makeAutoObservable } from "mobx";
import { RootModel } from "./root";

export class InviteModel {
  root: RootModel;
  editorProfile;
  text = "";

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  updateText(changes) {
    this.editorProfile = { ...this.editorProfile, ...changes };
  }

  formatText() {
    let rows = this.text.split("\n");
    return rows.map((row) => {
      const items = row.split(",");
      return {
        email: items[0],
        first_name: items[1],
        last_name: items[2],
        department_handle: items[3],
        department_position: items[4],
      };
    });
  }

  async invite() {
    const formatedText = this.formatText();
    const data = await this.root.POST("/profiles/invite/members", formatedText);
    if (!data) return;
    if (data.failed?.length > 0) {
      // TODO: Toast
      this.text = "";
    }
  }
}

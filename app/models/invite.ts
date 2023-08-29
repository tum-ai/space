import { makeAutoObservable } from "mobx";
import { RootModel } from "./root";
import axios from "axios";
import toast from "react-hot-toast";

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
    axios
      .post("/profiles/invite/members", {
        data: formatedText,
      })
      .then((data) => {
        // TODO: Check if this console log is necessary
        console.log(data);
        toast.success("Invite sent out successfully");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to invite");
        this.text = "";
      });
  }
}

import axios, { AxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import toast from "react-hot-toast";
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
    const data = await axios
      .post("/profiles/invite/members", {
        data: formatedText,
      })
      .then((response) => {
        return response.data;
      })
      .catch((err: AxiosError) => {
        toast.error(`Failed to invite: ${err.message}`);
      });
    if (data["failed"].length) {
      const message = data["failed"].map(
        (failedAccount) =>
          `${failedAccount["data"]["email"]}: ${failedAccount["error"]}\n`,
      );
      toast.error(message);
    } else {
      this.text = "";
    }
    if (data["succeeded"].length) {
      toast.success(`${data["succeeded"].length} Users successfully invited`);
    }
  }
}
// example: munzerdwedari@gmail.com,Munzer,Dwedar,DEV,member

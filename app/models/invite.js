import { makeAutoObservable } from "mobx";

export class InviteModel {
  root;
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
      this.root.uiModel.updateModalContent(
        <div className="flex flex-col space-y-2">
          <div className="">Failed to invite the following accounts:</div>
          {data.failed.map((obj) => (
            <div key={obj.data.email}>
              <span className="font-bold">{obj.data.email}</span>
              {": "}
              {obj.error}
            </div>
          ))}
        </div>,
      );
      this.root.uiModel.toggleModal();
    } else {
      this.root.uiModel.updateModalContent(
        <div className="flex flex-col space-y-2">
          Users invited successfully. They will receive an email shortly with a
          link to reset their password.
        </div>,
      );
      this.root.uiModel.toggleModal();
      this.text = "";
    }
  }
}

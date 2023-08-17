import { observer } from "mobx-react";
import ProtectedItem from "../components/ProtectedItem";
import Input from "@components/Input";
import Page from "@components/Page";
import Select from "@components/Select";
import { useStores } from "@providers/StoreProvider";

function Certificate() {
  const { certificateModel } = useStores();
  const certificate = certificateModel.editorCertificate;

  function handleChange(e) {
    certificateModel.updateEditorCertificate({
      [e.target.name]: e.target.value,
    });
  }

  const departments = [
    "Software Development (DEV)",
    "Marketing",
    "Industry",
    "Makeathon",
    "Community",
    "Partners & Sponsors (PnS)",
    "Legal & Finance (LnF)",
    "Venture",
    "Education",
    "Research & Development (RnD)",
  ];

  const positions = ["member", "teamlead", "advisor"];

  // TODO choose member's name from member profiles directly and fill in information accordingly
  return (
    <ProtectedItem showNotFound roles={["create_certificate"]}>
      <Page>
        <div className="text-6xl font-thin">Member Certificate</div>
        <div className="mt-8 flex w-full flex-col space-y-6 rounded-lg bg-white p-6 dark:bg-transparent">
          <div className="font-light">
            Fill out the form and a PDF will be automatically downloaded
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              console.log("form");
              await certificateModel.generateCertificate();
            }}
            className="grid grid-cols-1 items-end gap-4 lg:grid-cols-2 lg:gap-8"
          >
            <Select
              className="w-full bg-white dark:bg-gray-700"
              placeholder={"Department"}
              data={[
                ...departments?.map((department) => ({
                  key: department,
                  value: department,
                })),
              ]}
              selectedItem={{
                key: certificate["DEPARTMENT"],
                value: certificate["DEPARTMENT"],
              }}
              setSelectedItem={(item) => {
                certificateModel.updateEditorCertificate({
                  DEPARTMENT: item?.value,
                });
              }}
            />
            <Select
              className="w-full bg-white dark:bg-gray-700"
              placeholder={"Position"}
              data={[
                ...positions?.map((position) => ({
                  key: position,
                  value: position,
                })),
              ]}
              selectedItem={{
                key: certificate["TITLE"],
                value: certificate["TITLE"],
              }}
              setSelectedItem={(item) => {
                certificateModel.updateEditorCertificate({
                  TITLE: item?.value,
                });
              }}
            />
            <Input
              label="First Name"
              type="text"
              id="first_name"
              name="NAME"
              onChange={handleChange}
              required={true}
              value={certificate["NAME"]}
            />
            <Input
              label="Last Name"
              type="text"
              id="first_name"
              name="LASTNAME"
              onChange={handleChange}
              required={true}
              value={certificate["LASTNAME"]}
            />
            <Input
              label="Date Now"
              type="text"
              id="first_name"
              name="DATENOW"
              onChange={handleChange}
              required={true}
              value={certificate["DATENOW"]}
            />
            <Input
              label="Date Joined"
              type="text"
              id="first_name"
              name="DATEJOINED"
              onChange={handleChange}
              required={true}
              value={certificate["DATEJOINED"]}
            />
            <Input
              label="Pronoun (his/her)"
              type="text"
              id="first_name"
              name="PRONOUNPOS"
              onChange={handleChange}
              required={true}
              value={certificate["PRONOUNPOS"]}
            />
            <Input
              label="Date Signed On"
              type="text"
              id="first_name"
              name="SIGNED_ON"
              onChange={handleChange}
              required={true}
              value={certificate["SIGNED_ON"]}
            />
            <Input
              label="Contribution 1"
              type="text"
              id="first_name"
              name="CONTRIB_1"
              onChange={handleChange}
              required={true}
              value={certificate["CONTRIB_1"]}
            />
            <Input
              label="Contribution 2"
              type="text"
              id="first_name"
              name="CONTRIB_2"
              onChange={handleChange}
              required={true}
              value={certificate["CONTRIB_2"]}
            />
            <Input
              label="Contribution 3"
              type="text"
              id="first_name"
              name="CONTRIB_3"
              onChange={handleChange}
              required={true}
              value={certificate["CONTRIB_3"]}
            />
            <button
              type="submit"
              className="col-span-1 rounded-lg bg-gray-200 p-4 px-8 py-1 text-black lg:col-span-2"
            >
              save
            </button>
          </form>
        </div>
      </Page>
    </ProtectedItem>
    // TODO download button for cert
  );
}

export default observer(Certificate);

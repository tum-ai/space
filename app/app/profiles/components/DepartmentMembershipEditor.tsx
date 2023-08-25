import { Button } from "@components/Button";
import Input from "@components/Input";
import ProtectedItem from "@components/ProtectedItem";
import Select from "@components/Select";
import { useStores } from "@providers/StoreProvider";
import * as DialogRadix from "@radix-ui/react-dialog";
import { observer } from "mobx-react";

const positionTypes = [
  {
    key: "Teamlead",
    value: "teamlead",
  },
  {
    key: "President",
    value: "president",
  },
  {
    key: "Member",
    value: "member",
  },
  {
    key: "Alumni",
    value: "alumni",
  },
  {
    key: "Applicant",
    value: "applicant",
  },
];

const departmentTypes = [
  {
    key: "Software Development",
    value: "DEV",
  },
  {
    key: "Marketing",
    value: "MARKETING",
  },
  {
    key: "Industry",
    value: "INDUSTRY",
  },
  {
    key: "Makeathon",
    value: "MAKEATHON",
  },
  {
    key: "Community",
    value: "COMMUNITY",
  },
  {
    key: "Partners & Sponsors",
    value: "PNS",
  },
  {
    key: "Legal & Finance",
    value: "LNF",
  },
  {
    key: "Venture",
    value: "VENTURE",
  },
  {
    key: "Education",
    value: "EDUCATION",
  },
  {
    key: "Research & Development",
    value: "RND",
  },
];

function DepartmentMembershipEditor({ profile_id }) {
  const { uiModel, departmentMembershipsModel } = useStores();
  const departments = departmentMembershipsModel.departments;

  return (
    <ProtectedItem roles={["admin"]}>
      <div className="flex w-full flex-col space-y-6">
        <DialogRadix.Title className="flex items-center justify-between">
          <h1 className="text-3xl">Edit Membership</h1>
          <div className="col-span-2 flex space-x-2">
            <DialogRadix.Close>
              <Button
                onClick={async (e) => {
                  await departmentMembershipsModel.saveDepartments();
                }}
              >
                save
              </Button>
            </DialogRadix.Close>
            <DialogRadix.Close>
              <Button variant={"secondary"}>cancel</Button>
            </DialogRadix.Close>
          </div>
        </DialogRadix.Title>
        {/* DepartmentMembership Editor for Administrators */}
        <div className="col-span-2 w-full space-y-4">
          <div className="col-span-2 font-light text-black">
            Attention: You are editing the department memberships of this user
            as an administrator.
          </div>
          {departments &&
            departments.map((departmentMembership, index) => {
              if (profile_id !== departmentMembership.profile_id) {
                return null;
              }
              if (departmentMembership.new) {
                return (
                  <DepartmentMembershipNew
                    key={index}
                    departmentMembership={departmentMembership}
                    index={index}
                  />
                );
              } else {
                return (
                  <DepartmentMembership
                    key={index}
                    departmentMembership={departmentMembership}
                  />
                );
              }
            })}
          <Button
            onClick={() =>
              departmentMembershipsModel.handleAddDepartment(profile_id)
            }
          >
            Add Membership
          </Button>
        </div>
      </div>
    </ProtectedItem>
  );
}

function DepartmentMembership({ departmentMembership }) {
  const { departmentMembershipsModel } = useStores();
  return (
    <div className="flex w-fit items-center space-x-4 rounded-2xl border-2 bg-white p-4">
      <div>{departmentMembership.department_handle}</div>
      <div>{departmentMembership.position}</div>
      <div>
        {departmentMembership.time_from
          ? new Date(departmentMembership.time_from).toDateString()
          : "-"}
      </div>
      <div>
        {departmentMembership.time_from
          ? new Date(departmentMembership.time_to).toDateString()
          : "-"}
      </div>
      <Button
        variant={"secondary"}
        onClick={async () => {
          await departmentMembershipsModel.deleteDepartmentMembership(
            departmentMembership.id,
          );
          departmentMembershipsModel.handleRemoveDepartment(
            departmentMembership.id,
          );
        }}
      >
        Remove
      </Button>
    </div>
  );
}

const DepartmentMembershipNew = observer(({ departmentMembership, index }) => {
  const { departmentMembershipsModel } = useStores();
  return (
    <div key={index} className="rounded-2xl border-2 border-gray-100 p-4">
      <Select
        setSelectedItem={(item) =>
          departmentMembershipsModel.handleSelect(
            item,
            index,
            "department_handle",
          )
        }
        selectedItem={{
          key: departmentMembership.department_handle,
          value: departmentMembership.department_handle,
        }}
        placeholder="Select an option"
        data={departmentTypes}
        label="Department"
        disabled={false}
      />
      <Select
        setSelectedItem={(item) =>
          departmentMembershipsModel.handleSelect(item, index, "position")
        }
        selectedItem={{
          key: departmentMembership.position,
          value: departmentMembership.position,
        }}
        placeholder="Select an option"
        data={positionTypes}
        label="Position"
        disabled={false}
      />
      <Input
        label="Time from"
        type="datetime-local"
        name="time_from"
        required={true}
        value={departmentMembership.time_from}
        onChange={(e) =>
          departmentMembershipsModel.handleListItemChange(e, index)
        }
      />
      <Input
        label="Time to"
        type="datetime-local"
        name="time_to"
        required={true}
        value={departmentMembership.time_to}
        onChange={(e) =>
          departmentMembershipsModel.handleListItemChange(e, index)
        }
      />

      <button
        type="button"
        onClick={async () => {
          await departmentMembershipsModel.deleteDepartmentMembership(
            departmentMembership.id,
          );
          departmentMembershipsModel.handleRemoveDepartment(
            departmentMembership.id,
          );
        }}
      >
        Remove
      </button>
    </div>
  );
});

export default observer(DepartmentMembershipEditor);

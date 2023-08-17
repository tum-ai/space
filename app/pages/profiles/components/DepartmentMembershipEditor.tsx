import { observer } from "mobx-react";
import Input from "/components/Input";
import ProtectedItem from "/components/ProtectedItem";
import Select from "/components/Select";
import { useStores } from "/providers/StoreProvider";

const positionTypes = [
  {
    key: "TEAMLEAD",
    value: "Teamlead",
  },
  {
    key: "PRESIDENT",
    value: "President",
  },
  {
    key: "MEMBER",
    value: "Member",
  },
  {
    key: "ALUMNI",
    value: "Alumni",
  },
  {
    key: "APPLICANT",
    value: "Applicant",
  },
];

const departmentTypes = [
  {
    key: "DEV",
    value: "Software Development",
  },
  {
    key: "MARKETING",
    value: "Marketing",
  },
  {
    key: "INDUSTRY",
    value: "Industry",
  },
  {
    key: "MAKEATHON",
    value: "Makeathon",
  },
  {
    key: "COMMUNITY",
    value: "Community",
  },
  {
    key: "PNS",
    value: "Partners & Sponsors",
  },
  {
    key: "LNF",
    value: "Legal & Finance",
  },
  {
    key: "VENTURE",
    value: "Venture",
  },
  {
    key: "EDUCATION",
    value: "Education",
  },
  {
    key: "RND",
    value: "Research & Development",
  },
];

function DepartmentMembershipEditor({ profile_id }) {
  const { uiModel, departmentMembershipsModel } = useStores();
  const departments = departmentMembershipsModel.departments;

  return (
    <ProtectedItem roles={["admin"]}>
      <div className="flex w-full flex-col space-y-6 rounded-lg bg-white p-6 dark:bg-gray-700">
        <div className="text-2xl font-light">Department Membership Editor</div>
        <hr className="col-span-2" />
        {/* DepartmentMembership Editor for Administrators */}
        <div className="col-span-2 w-full space-y-4">
          <div className="col-span-2 text-xl font-light">
            Department Memberships
          </div>
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
          <button
            className="mt-4 rounded-lg bg-gray-200 p-2 hover:text-black hover:underline dark:bg-gray-700 dark:hover:text-white"
            onClick={() =>
              departmentMembershipsModel.handleAddDepartment(profile_id)
            }
          >
            Add Membership
          </button>
        </div>
        <hr className="col-span-2" />
        <div className="col-span-2 flex space-x-2">
          <button
            type="submit"
            className="w-1/2 rounded-lg bg-gray-200 p-4 px-8 py-1 text-black"
            onClick={async (e) => {
              e.preventDefault();
              console.log([...departmentMembershipsModel.departments]);
              await departmentMembershipsModel.saveDepartments();
            }}
          >
            <div>save</div>
          </button>
          <button
            onClick={() => {
              uiModel.toggleModal();
            }}
            className="w-1/2 rounded-lg border-2 p-4 px-8 py-1"
          >
            <div>cancel</div>
          </button>
        </div>
      </div>
    </ProtectedItem>
  );
}

function DepartmentMembership({ departmentMembership }) {
  const { departmentMembershipsModel } = useStores();
  return (
    <div className="rounded-2xl border-2 border-gray-100 p-4">
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
        name="department_handle"
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
        name="position"
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

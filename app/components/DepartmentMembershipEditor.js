import { observer } from "mobx-react";
import Input from "/components/Input";
import { useStores } from "/providers/StoreProvider";
import ProtectedItem from "/components/ProtectedItem";
import Select from "/components/Select";
import { useEffect, useState } from "react";
import axios from "axios";

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

const newDepartmentMembership = {
  profile_id: -1,
  department_handle: "",
  position: "",
  time_from: "2023-07-13T12:24:47.322994",
  time_to: "2023-07-13T12:24:47.322995",
};

function DepartmentMembershipEditor({ profile_id }) {
  const { uiModel } = useStores();
  const [departments, setDepartments] = useState([]);

  function handleAddExperience() {
    newDepartmentMembership.profile_id = profile_id;
    if (departments.length === 0) {
      setDepartments([newDepartmentMembership]);
      return;
    }
    setDepartments([...departments, { ...newDepartmentMembership }]);
  }

  function handleRemoveExperience(index) {
    setDepartments(departments.filter((_, i) => i !== index));
  }

  function handleListItemChange(event, index) {
    const { name, value } = event.target;
    const updatedProfile = departments.map((item, i) => {
      return i === index ? { ...item, [name]: value } : item;
    });
    setDepartments(updatedProfile);
  }

  const handleSelect = (item, index, type) => {
    const updatedSelectedOptions = [...departments];
    updatedSelectedOptions[index][type] = item.key;
    setDepartments(updatedSelectedOptions);
  };

  // fetch departments from the API and populate it depending on the profile id
  useEffect(() => {
    async function fetchDepartments() {
      try {
        // Make the GET request to the department endpoint
        const data = (await axios(`/department-memberships`)).data.data;
        if (data) {
          data.map((item) => {
            item.department_handle = item.department.handle;
            item.position = item.position.replace("PositionType.", "");
            item.profile_id = item.profile.id;
            delete item.profile;
            delete item.department;
          });
          console.log(data);
          setDepartments(data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    }

    fetchDepartments();
  }, []);
  return (
    <ProtectedItem roles={["admin"]}>
      <div className="flex flex-col space-y-6 rounded-lg p-6 bg-white dark:bg-gray-700 w-full">
        <div className="text-2xl font-light">Department Membership Editor</div>
        <hr className="col-span-2" />
        {/* DepartmentMembership Editor for Administrators */}
        <div className="w-full col-span-2 space-y-4">
          <div className="col-span-2 text-xl font-light">
            Department Memberships
          </div>
          <div className="col-span-2 text-black font-light">
            Attention: You are editing the department memberships of the user as
            an administrator. TODO
          </div>
          {departments &&
            departments.map((experience, index) => {
              if (profile_id !== experience.profile_id) {
                return null;
              }
              return (
                <div
                  key={index}
                  className="border-2 border-gray-100 rounded-2xl p-4"
                >
                  <Select
                    setSelectedItem={(item) =>
                      handleSelect(item, index, "department_handle")
                    }
                    selectedItem={{
                      key: experience.department_handle,
                      value: experience.department_handle,
                    }}
                    placeholder="Select an option"
                    data={departmentTypes}
                    name="department_handle"
                    label="Department"
                    disabled={false}
                  />
                  <Select
                    setSelectedItem={(item) =>
                      handleSelect(item, index, "position")
                    }
                    selectedItem={{
                      key: experience.position,
                      value: experience.position,
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
                    value={experience.time_from}
                    onChange={(e) => handleListItemChange(e, index)}
                  />
                  <Input
                    label="Time to"
                    type="datetime-local"
                    name="time_to"
                    required={true}
                    value={experience.time_to}
                    onChange={(e) => handleListItemChange(e, index)}
                  />
                  <button onClick={() => handleRemoveExperience(index)}>
                    Remove
                  </button>
                </div>
              );
            })}
          <button
            className="hover:text-black mt-4 dark:hover:text-white hover:underline bg-gray-200 dark:bg-gray-700 p-2 rounded-lg"
            onClick={() => handleAddExperience()}
          >
            Add Membership
          </button>
        </div>
        <hr className="col-span-2" />
        <div className="col-span-2 flex space-x-2">
          <button
            type="submit"
            className="p-4 px-8 py-1 rounded-lg w-1/2 bg-gray-200 text-black"
            onClick={async (e) => {
              e.preventDefault();
              console.log("deps", departments);
              const response = await axios.post(
                `/department-memberships`,
                departments
              );
              console.log("response", response);
              uiModel.toggleModal();
            }}
          >
            <div>save</div>
          </button>
          <button
            onClick={() => {
              uiModel.toggleModal();
            }}
            className="p-4 px-8 py-1 rounded-lg w-1/2 border-2"
          >
            <div>cancel</div>
          </button>
        </div>
      </div>
    </ProtectedItem>
  );
}

export default observer(DepartmentMembershipEditor);

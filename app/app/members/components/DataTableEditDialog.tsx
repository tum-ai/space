"use client";
import Dialog from "@components/Dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "@components/ui/button";
import { useEffect } from "react";
import { useState } from "react";
import { Badge } from "@components/ui/badge";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "@components/ui/select";
import {
  getMembership,
  getDepartmentsMap,
  getRolesMap,
  getPositionsMap,
  updateMembership,
  createMembership,
  updateProfile,
} from "@lib/retrievals";

export default function DataTableEditDialog({ rows, tableData, ...props }) {
  const [rowData, setRowData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [positions, setPositions] = useState([]);

  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    setRowData(rows);

    const fetchData = async () => {
      try {
        const departments = await getDepartmentsMap();
        const roles = await getRolesMap();
        const positions = await getPositionsMap();
        setDepartments(departments);
        setRoles(roles);
        setPositions(positions);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [rows]);

  const handleInputChange = (key: string, value: string) => {
    switch (key) {
      case "role":
        setSelectedRole(value);
        break;
      case "currentDepartment":
        setSelectedDepartment(value);
        break;
      case "position":
        setSelectedPosition(value);
        break;
    }
  };

  const handleSubmit = () => {
    const updateMembershipData = async () => {
      try {
        for (let i = 0; i < rowData.length; i++) {
          const row = rowData[i];
          const userId = row.id;
          let departmentId;

          for (let index = 0; index < tableData.length; index++) {
            const profile = tableData[index];

            if (profile.id != userId) {
              continue;
            }

            departmentId = profile.currentDepartment.id;
            break;
          }

          const membershipData = {
            membershipStart: new Date(),
            membershipEnd: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            user: {
              connect: {
                id: userId,
              },
            },
          };

          if (selectedDepartment) {
            membershipData["department"] = {
              connect: {
                id: selectedDepartment,
              },
            };
          }

          if (selectedPosition) {
            membershipData["departmentPosition"] = selectedPosition;
          }

          if (selectedDepartment && selectedPosition) {
            try {
              let response = await createMembership(membershipData);
            } catch (error) {
              if (error.response.status == 409) {
                //Membership does not exist, create it
                try {
                  let response = await getMembership(userId, departmentId);
                  const membershipId = response.data.id;

                  //TODO make the UPDATE request to DB
                  response = await updateMembership(membershipId, {
                    updatedAt: new Date(),
                  });
                } catch (error) {
                  console.error(
                    "something went wrong updating membership",
                    error,
                  );
                }
              } else {
                console.error(
                  "something went wrong creating membership",
                  error,
                );
              }
            }
          }

          if (selectedRole) {
            try {
              let response = await updateProfile(userId, {
                userRoles: {
                  connect: {
                    name: selectedRole,
                  },
                },
                updatedAt: new Date(),
              });
            } catch (error) {
              console.error("something went wrong updating profile", error);
            }
          }
        }
      } catch (error) {
        console.error("wrong data", error);
      }
    };

    try {
      const response = updateMembershipData();
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <div className="ml-auto lg:flex">
      <Dialog
        trigger={
          <Button disabled={rowData.length === 0} size="sm" className="h-8">
            Edit {rowData.length}
          </Button>
        }
      >
        <DialogClose className="float-right">
          <Cross1Icon className="h-5 w-5 text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-400" />
        </DialogClose>
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-9">
            <div className="flex flex-col gap-2">
              <p className="text-slate-400">Edit</p>
              <div className="flex gap-1">
                {rowData.slice(0, 5).map((row, index) => {
                  return <Badge key={index}>{row.email}</Badge>;
                })}
                {rowData.length > 5 && <Badge>+{rowData.length - 5}</Badge>}
              </div>
            </div>
            <div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-sm text-slate-400">Role</p>
                  <Select
                    onValueChange={(input) => handleInputChange("role", input)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {roles.map((role) => (
                          <SelectItem key={role.label} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Department</p>
                  <Select
                    onValueChange={(input) =>
                      handleInputChange("currentDepartment", input)
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {departments.map((department) => (
                          <SelectItem
                            key={department.label}
                            value={department.value}
                          >
                            {department.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Position</p>
                  <Select
                    onValueChange={(input) =>
                      handleInputChange("position", input)
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {positions.map((position) => (
                          <SelectItem
                            key={position.label}
                            value={position.value}
                          >
                            {position.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="ml-auto flex gap-2">
              <DialogClose>
                <Button type="submit" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose>
                <Button type="submit" onClick={handleSubmit}>
                  Save Changes
                </Button>
              </DialogClose>
            </span>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

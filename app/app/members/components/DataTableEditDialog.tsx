"use client";
import Dialog from "@components/Dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "@components/ui/button";
import { useEffect } from "react";
import { useState } from "react";
import { Badge } from "@components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
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
  deleteMembership,
} from "@services/membershipService";
import { AxiosResponse } from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@components/ui/card";

export default function DataTableEditDialog({ rows, tableData }) {
  const [assign, setAssign] = useState("add");
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

  const handleDelete = async (userId: string, departmentId: string) => {
    let response: AxiosResponse<any, any>;

    if (selectedDepartment) {
      response = await getMembership(userId, selectedDepartment);
      const membershipId = response.data?.id;

      if (!membershipId) {
        return null;
      }

      response = await deleteMembership(membershipId);
    }

    if (selectedRole) {
      try {
        response = await updateProfile(userId, {
          userToUserRoles: {
            deleteMany: {
              userId: userId,
              roleId: selectedRole,
            },
          },
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSave = async (userId: string, departmentId: string) => {
    let response: AxiosResponse<any, any>;

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
      membershipData.department = {
        connect: {
          id: selectedDepartment,
        },
      };
    }

    if (selectedPosition) {
      membershipData.departmentPosition = selectedPosition;
    }

    if (selectedDepartment && selectedPosition) {
      try {
        response = await createMembership(membershipData);
      } catch (error) {
        if (error.response.status == 409) {
          //Membership does not exist, create it

          response = await getMembership(userId, departmentId);
          const membershipId = response.data.id;

          //TODO make the UPDATE request to DB
          response = await updateMembership(membershipId, {
            updatedAt: new Date(),
          });
        } else {
          throw new Error(error);
        }
      }
    }

    if (selectedRole) {
      response = await updateProfile(userId, {
        userToUserRoles: {
          create: {
            role: {
              connect: {
                name: selectedRole,
              },
            },
          },
        },
        updatedAt: new Date(),
      });
    }

    return response;
  };

  const handleSubmit = () => {
    const updateMembershipData = async () => {
      for (let i = 0; i < rowData.length; i++) {
        const row = rowData[i];
        const userId = row.id;
        let departmentId: string;

        for (let index = 0; index < tableData.length; index++) {
          const profile = tableData[index];

          if (profile.id != userId) {
            continue;
          }

          departmentId = profile.departmentMemberships[0]?.department.id;
          break;
        }

        try {
          if (assign === "add") {
            await handleSave(userId, departmentId);
          } else {
            await handleDelete(userId, departmentId);
          }
        } catch (error) {
          console.error("something went wrong updating", error);
        }
      }
    };

    updateMembershipData().then(() => {
      window.location.reload();
    });
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
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <Tabs defaultValue="add" onValueChange={setAssign}>
              <div className="flex-col gap-8">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="add">Add</TabsTrigger>
                  <TabsTrigger value="delete">Delete</TabsTrigger>
                </TabsList>
                <TabsContent value="add">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-row content-center justify-between">
                        <CardTitle>Assign</CardTitle>
                        <div className="centre flex flex-col gap-1">
                          <div className="flex gap-1">
                            {rowData.slice(0, 5).map((row, index) => {
                              return <Badge key={index}>{row.email}</Badge>;
                            })}
                            {rowData.length > 5 && (
                              <Badge>+{rowData.length - 5}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <CardDescription>
                        Assign Members to a Role, Department, and Position
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <p className="text-sm text-slate-400">Role</p>
                            <Select
                              onValueChange={(input) =>
                                handleInputChange("role", input)
                              }
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {roles?.map((role) => (
                                    <SelectItem
                                      key={role.label}
                                      value={role.value}
                                    >
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
                        <div className="flex gap-4">
                          <span className="ml-auto flex gap-2">
                            <DialogClose>
                              <Button type="submit" variant="outline">
                                Cancel
                              </Button>
                            </DialogClose>
                            <DialogClose>
                              <Button type="submit" onClick={handleSubmit}>
                                Assign
                              </Button>
                            </DialogClose>
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="delete">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-row content-center justify-between">
                        <CardTitle>Delete</CardTitle>
                        <div className="centre flex flex-col gap-1">
                          <div className="flex gap-1">
                            {rowData.slice(0, 5).map((row, index) => {
                              return <Badge key={index}>{row.email}</Badge>;
                            })}
                            {rowData.length > 5 && (
                              <Badge>+{rowData.length - 5}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <CardDescription>
                        Delete Members from a Role or Department
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex flex-col gap-6">
                        <div className="lex justify-content:flex-start flex-col">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-sm text-slate-400">Role</p>
                              <Select
                                onValueChange={(input) =>
                                  handleInputChange("role", input)
                                }
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {roles?.map((role) => (
                                      <SelectItem
                                        key={role.label}
                                        value={role.value}
                                      >
                                        {role.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <p className="text-sm text-slate-400">
                                Department
                              </p>
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
                                Delete
                              </Button>
                            </DialogClose>
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

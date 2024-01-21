"use client";
import Dialog from "@components/Dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "@components/ui/button";
import { useEffect } from "react";
import { useState } from "react";
import { Badge } from "@components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { updateMembership, getDepartmentsMap, getRolesMap, getPositionsMap, createMembership } from "@lib/retrievals";


export default function DataTableEditDialog(props: any) {
  const [data, setData] = useState(props.rows);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    setData(props.rows);

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
  }, [props.rows]);

  const handleInputChange = (
    attributeName: string,
    newValue: any,
  ) => {
    
  };

  const handleSubmit = () => {

    const updateMembershipData = async () => {

      const userId = data.id;
      const departmentId = data.department;
      
      if (!userId) {
        console.error('data wrong format to submit')
        return;
      }

      if (departmentId) {
        console.error('data wrong format to submit')
        return;
      }
      //TODO validate inputs


      try {
        let response = await updateMembership(userId, data);
        if (response.status == 404) {
          response = await createMembership(userId, departmentId, data);
        }
        return response.data;
      } catch (error) {
        throw new Error(error);
      }

    }
    
    try {
      const response = updateMembershipData();
    } catch (error) {
      throw new Error(error);
    }
    


    //TODO make the UPDATE request to DB

    //TODO make sure table in parent component DataTable is also updated
  };

  return (
    <div className="ml-auto lg:flex">
      <Dialog
        trigger={<Button disabled={data.length === 0} size="sm" className="h-8">Edit {data.length}</Button>}
      >
        
        <DialogClose className="float-right">
          <Cross1Icon className="h-5 w-5 text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-400" />
        </DialogClose>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <p className="text-slate-400">Edit</p>
              <div className="flex gap-1">
              {data.slice(0, 5).map((row, index) => {
                  return <Badge key={index}>{row.email}</Badge>
                })}
                {data.length > 5 && <Badge>+{data.length - 5}</Badge>}
              </div>
            </div>
            <div>
              <div className="grid grid-cols-3 gap-2">
                <p className="text-sm text-slate-400">Department</p>
                <p className="text-sm text-slate-400">Permission</p>
                <p className="text-sm text-slate-400">Position</p>
              </div>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                      onValueChange={(input) =>
                        handleInputChange("currentDepartment", input)
                      }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder={""} />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectGroup>
                      {departments.map((department) => (
                        <SelectItem key={department.label} value={department.value}>
                          {department.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(input) =>
                      handleInputChange("permission", input)
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder={""} />
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
                  <Select
                    onValueChange={(input) =>
                      handleInputChange("position", input)
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder={""} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {positions.map((position) => (
                          <SelectItem key={position.label} value={position.value}>
                            {position.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            
            <span className="flex justify-end gap-2">
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

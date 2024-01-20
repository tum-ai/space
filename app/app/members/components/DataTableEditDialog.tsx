"use client";
import Dialog from "@components/Dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "@components/ui/button";
import { useEffect } from "react";
import { useState } from "react";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { updateMembership, getDepartmentsMap, getPermissionsMap, getPositionsMap, createMembership } from "@lib/retrievals";


export default function DataTableEditDialog(props: any) {
  const [data, setData] = useState(props.rows);
  const [visible, setVisible] = useState(props.visible);
  const [departments, setDepartments] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    setData(props.rows);
    setVisible(props.visible);

    const fetchData = async () => {
      try {
        const departments = await getDepartmentsMap();
        const permissions = await getPermissionsMap();
        const positions = await getPositionsMap();
        setDepartments(departments);
        setPermissions(permissions);
        setPositions(positions);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [props.rows, props.visible]);

  const handleInputChange = (
    id: number,
    attributeName: string,
    newValue: any,
  ) => {
    const newData = props.rows.map((item) =>
      item.id === id ? { ...item, [attributeName]: newValue } : item,
    );
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
    
    setVisible(false);

    //TODO make the UPDATE request to DB

    //TODO make sure table in parent component DataTable is also updated
  };

  return (
    <div>
      <Dialog
        trigger={true}
        isOpenOutside={visible} 
        setIsOpenOutside={setVisible}
      >
        <DialogClose className="float-right" onClick={() => setVisible(false)}>
          <Cross1Icon className="h-5 w-5 text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-400" />
        </DialogClose>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-slate-400">Edit</p>
            <div className="grid grid-cols-8 gap-2">
              <p className="col-span-1 text-sm text-slate-400">ID</p>
              <p className="col-span-2 text-sm text-slate-400">Email</p>
              <p className="text-sm text-slate-400">First name</p>
              <p className="text-sm text-slate-400">Last name</p>
              <p className="text-sm text-slate-400">Department</p>
              <p className="text-sm text-slate-400">Permission</p>
              <p className="text-sm text-slate-400">Position</p>
            </div>
            {data.map((row) => (
              <div key={row.id} className="grid grid-cols-8 gap-2">
                <Input
                  value={row.id}
                  className="col-span-1 h-8"
                  disabled={true}
                />
                <Input
                  value={row.email}
                  onChange={(evt) =>
                    handleInputChange(row.id, "email", evt.target.value)
                  }
                  className="col-span-2 h-8"
                />
                <Input
                  value={row.first_name}
                  onChange={(evt) =>
                    handleInputChange(row.id, "first_name", evt.target.value)
                  }
                  className="h-8 "
                />
                <Input
                  value={row.last_name}
                  onChange={(evt) =>
                    handleInputChange(row.id, "last_name", evt.target.value)
                  }
                  className="h-8 "
                />
                <Select
                  onValueChange={(input) =>
                    handleInputChange(row.id, "current_department", input)
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder={row.current_department} />
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
                    handleInputChange(row.permission, "permission", input)
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder={row.permission} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {permissions.map((permission) => (
                        <SelectItem key={permission.label} value={permission.value}>
                          {permission.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(input) =>
                    handleInputChange(row.position, "position", input)
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder={row.position} />
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
            ))}
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

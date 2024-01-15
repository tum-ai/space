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
export default function DataTableEditDialog(props: any) {
  const DEFAULT_DATA = {
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    current_department: "",
    permission: "",
    current_department_position: "",
  };

  const [data, setData] = useState(props.rows);

  useEffect(() => {
    setData(props.rows);
  }, [props.rows]);

  const handleInputChange = (
    id: number,
    attributeName: string,
    newValue: any,
  ) => {
    const newData = props.rows.map((item) =>
      item.id === id ? { ...item, [attributeName]: newValue } : item,
    );
    setData(newData);
    console.info(data);
  };

  const handleSubmit = () => {
    console.info("move this data to DB", data);
    //TODO validate inputs

    //TODO make the UPDATE request to DB

    //TODO make sure table in parent component DataTable is also updated
  };

  return (
    <div>
      <Dialog
        trigger={
          <Button
            variant="outline"
            className="h-8 px-2 lg:px-3"
            disabled={!props.rows.length}
          >
            Edit
          </Button>
        }
      >
        <DialogClose className="float-right">
          <Cross1Icon className="h-5 w-5 text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-400" />
        </DialogClose>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-slate-400">Edit all members</p>
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
              <div className="grid grid-cols-8 gap-2">
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
                      <SelectItem value="DEV">DEV</SelectItem>
                      <SelectItem value="LnF">LnF</SelectItem>
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
                      <SelectItem value="admin">admin</SelectItem>
                      <SelectItem value="user">user</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Input
                  value={row.current_department_position}
                  onChange={(evt) =>
                    handleInputChange(row.id, "position", evt.target.value)
                  }
                  className="h-8 "
                />
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

"use client";
import Dialog from "@components/Dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "@components/ui/button";
import { useEffect } from "react";
import { useState } from "react";
import { Input } from "@components/ui/input";
export default function DataTableEditDialog(props: any) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(props.rows);
  }, []);

  const handleInputChange = (id, attributeName, newValue) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [attributeName]: newValue } : item,
      ),
    );
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
          <p className="text-slate-400">Edit selected members</p>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-8 gap-2">
              <p className="col-span-1">ID</p>
              <p className="col-span-2">Email</p>
              <p>First name</p>
              <p>Last name</p>
              <p>Department</p>
              <p>Permission</p>
              <p>Position</p>
            </div>
            {props.rows.map((row) => (
              <div className="grid grid-cols-8 gap-2">
                <Input
                  defaultValue={row.id}
                  onChange={(evt) =>
                    handleInputChange(row.id, "email", evt.target.value)
                  }
                  className="col-span-1 h-8"
                  disabled={true}
                />
                <Input
                  defaultValue={row.email}
                  onChange={(evt) =>
                    handleInputChange(row.id, "email", evt.target.value)
                  }
                  className="col-span-2 h-8"
                />
                <Input
                  defaultValue={row.first_name}
                  onChange={(evt) =>
                    handleInputChange(row.id, "first_name", evt.target.value)
                  }
                  className="h-8 "
                />
                <Input
                  defaultValue={row.last_name}
                  onChange={(evt) =>
                    handleInputChange(row.id, "last_name", evt.target.value)
                  }
                  className="h-8 "
                />
                <Input
                  defaultValue={row.department}
                  onChange={(evt) =>
                    handleInputChange(row.id, "department", evt.target.value)
                  }
                  className="h-8 "
                />
                <Input
                  defaultValue={row.permission}
                  onChange={(evt) =>
                    handleInputChange(row.id, "permission", evt.target.value)
                  }
                  className="h-8 "
                />
                <Input
                  defaultValue={row.position}
                  onChange={(evt) =>
                    handleInputChange(row.id, "position", evt.target.value)
                  }
                  className="h-8 "
                />
              </div>
            ))}
          </div>
          <span className="flex justify-end gap-2">
            <DialogClose className="float-right">
              <Button type="submit" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose className="float-right">
              <Button type="submit" onClick={handleSubmit}>
                Save Changes
              </Button>
            </DialogClose>
          </span>
        </div>
      </Dialog>
    </div>
  );
}

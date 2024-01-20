"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { DataTableViewOptions } from "./DataTableViewOptions";

import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import React, { useState, useEffect } from "react";
import {
  getPermissionsMap,
  getPositionsMap,
  getDepartmentsMap,
} from "@lib/retrievals";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [departments, setDepartments] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
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
  }, []);

  const getSelectedRows = () => {
    const tmp = [];
    table
      .getRowModel()
      .rows.filter((row) => row.getIsSelected())
      .map((row) => {
        tmp.push(row._valuesCache);
      });
    return tmp;
  };

  return (
    <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
      <div
        className="flex flex-1 flex-wrap items-center gap-2"
        style={{ maxWidth: "100%" }}
      >
        <Input
          placeholder={`Filter ${table.getColumn("email")?.columnDef[
            "label"
          ]}...`}
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[150px] lg:w-[250px]"
        />
        <Input
          placeholder={`Filter ${table.getColumn("last_name")?.columnDef[
            "label"
          ]}...`}
          value={
            (table.getColumn("last_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("last_name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[150px] lg:w-[250px]"
        />
        {table.getColumn("permission") && (
          <DataTableFacetedFilter
            column={table.getColumn("permission")}
            title={table.getColumn("permission").columnDef["label"]}
            options={permissions}
          />
        )}
        {table.getColumn("current_department") && (
          <DataTableFacetedFilter
            column={table.getColumn("current_department")}
            title={table.getColumn("current_department").columnDef["label"]}
            options={departments}
          />
        )}
        {table.getColumn("current_department_position") && (
          <DataTableFacetedFilter
            column={table.getColumn("current_department_position")}
            title={
              table.getColumn("current_department_position").columnDef["label"]
            }
            options={positions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}

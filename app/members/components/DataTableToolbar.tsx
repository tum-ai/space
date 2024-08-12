import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { DataTableViewOptions } from "./DataTableViewOptions";

import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import React, { useState, useEffect } from "react";
import { ColumnDefs, ExtendedColumnDef, Option, RowUser } from "./DataTableTypes";


interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  columnDefs: ColumnDefs;
}

export function DataTableToolbar<TData>({
  table,
  columnDefs,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [departments, setDepartments] = useState<Option[]>([]);
  const [roles, setRoles] = useState<Option[]>([]);
  const [positions, setPositions] = useState<Option[]>([]);

  useEffect(() => {
    setDepartments(columnDefs.departments);
    setRoles(columnDefs.roles);
    setPositions(columnDefs.positions);
  }, [columnDefs.departments, columnDefs.positions, columnDefs.roles]);

  // Remove the unused getSelectedRows function
  // const getSelectedRows = () => {
  //   const tmp: TData[] = [];
  //   table
  //     .getRowModel()
  //     .rows.filter((row) => row.getIsSelected())
  //     .map((row) => {
  //       tmp.push(row._valuesCache as TData);
  //     });
  //   return tmp;
  // };

  return (
    <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
      <div
        className="flex flex-1 flex-wrap items-center gap-2"
        style={{ maxWidth: "100%" }}
      >
        <Input
          placeholder={`Filter ${(table.getColumn("email")?.columnDef as ExtendedColumnDef<RowUser, unknown>).label}...`}
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[150px] lg:w-[250px]"
        />
        <Input
          placeholder={`Filter ${(table.getColumn("name")?.columnDef as ExtendedColumnDef<RowUser, unknown>).label}...`}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[150px] lg:w-[250px]"
        />
        {table.getColumn("roles") && (
          <DataTableFacetedFilter
            column={table.getColumn("roles")}
            title={
              (
                table.getColumn("roles")?.columnDef as ExtendedColumnDef<
                  RowUser,
                  unknown
                >
              ).label
            }
            options={roles.map((role) => ({
              label: String(role.label),
              value: String(role.value),
            }))}
          />
        )}
        {table.getColumn("currentDepartment") && (
          <DataTableFacetedFilter
            column={table.getColumn("currentDepartment")}
            title={
              (
                table.getColumn("currentDepartment")
                  ?.columnDef as ExtendedColumnDef<RowUser, unknown>
              ).label
            }
            options={departments.map((department) => ({
              label: String(department.label),
              value: String(department.value),
            }))}
          />
        )}
        {table.getColumn("currentDepartmentPosition") && (
          <DataTableFacetedFilter
            column={table.getColumn("currentDepartmentPosition")}
            title={
              (
                table.getColumn("currentDepartmentPosition")
                  ?.columnDef as ExtendedColumnDef<RowUser, unknown>
              ).label
            }
            options={positions.map((position) => ({
              label: String(position.label),
              value: String(position.value),
            }))}
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

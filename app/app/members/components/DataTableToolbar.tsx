"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { DataTableViewOptions } from "./DataTableViewOptions";

import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import React, { useState, useEffect } from "react";
import {
  getRolesMap,
  getPositionsMap,
  getDepartmentsMap,
} from "@services/membershipService";
import DataTableEditDialog from "./DataTableEditDialog";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  tableData: object;
}

export function DataTableToolbar<TData>({
  table,
  tableData,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
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
          placeholder={`Filter ${table.getColumn("email")?.columnDef.label}...`}
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[150px] lg:w-[250px]"
        />
        <Input
          placeholder={`Filter ${table.getColumn("lastName")?.columnDef.label}...`}
          value={
            (table.getColumn("lastName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("lastName")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[150px] lg:w-[250px]"
        />
        {table.getColumn("userRoles") && (
          <DataTableFacetedFilter
            column={table.getColumn("userRoles")}
            title={table.getColumn("userRoles").columnDef.label}
            options={roles}
          />
        )}
        {table.getColumn("currentDepartment") && (
          <DataTableFacetedFilter
            column={table.getColumn("currentDepartment")}
            title={table.getColumn("currentDepartment").columnDef.label}
            options={departments}
          />
        )}
        {table.getColumn("currentDepartmentPosition") && (
          <DataTableFacetedFilter
            column={table.getColumn("currentDepartmentPosition")}
            title={table.getColumn("currentDepartmentPosition").columnDef.label}
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
      <DataTableEditDialog tableData={tableData} rows={getSelectedRows()} />
      <DataTableViewOptions table={table} />
    </div>
  );
}

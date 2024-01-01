"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { DataTableViewOptions } from "./DataTableViewOptions"

import { DataTableFacetedFilter } from "./DataTableFacetedFilter"
import { UserPermission, DepartmentPosition } from "@prisma/client"
import React, { useState, useEffect } from 'react';

import axios from "axios"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}


const permissions = Object.keys(UserPermission).map((permission) => ({
    label: String(permission[0].toUpperCase() + permission.slice(1)).replaceAll('_', ' '),
    value: permission,
}));

const position = Object.keys(DepartmentPosition).map((position) => ({
    label: String(position[0].toUpperCase() + position.slice(1)).replaceAll('_', ' '),
    value: position,
}));


export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await axios.get("http://localhost:3000/api/departments").catch((err) => {
        if (err.status === 403) {
          return;
        }
        throw err;
      });
      if (!response) {
        return;
      }
      const departments = response.data.departments.map((department) => ({
        label: String(department.name[0].toUpperCase() + department.name.slice(1)).replaceAll('_', ' '),
        value: department.name,
      }));
      setDepartments(departments);
    };

    fetchDepartments();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex flex-1 flex-wrap items-center gap-2" style={{ maxWidth: '100%' }}>
        <Input
          placeholder={`Filter ${table.getColumn("email")?.columnDef["label"]}...`}
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[150px] lg:w-[250px]"
        />
        <Input
          placeholder={`Filter ${table.getColumn("last_name")?.columnDef["label"]}...`}
          value={(table.getColumn("last_name")?.getFilterValue() as string) ?? ""}
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
            title={table.getColumn("current_department_position").columnDef["label"]}
            options={position}
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
  )
}
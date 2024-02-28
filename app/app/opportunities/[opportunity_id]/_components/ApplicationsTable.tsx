"use client";
import React from "react";
import { Application } from "@prisma/client";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";

export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: 'id', // Direct key access, no change needed
    header: () => 'ID',
    cell: info => info.getValue().toString(), // Ensure string representation
  },
  {
    accessorKey: 'createdAt', // Assuming direct key access
    header: () => 'Created At',
    cell: info => info.getValue().toLocaleString(), // Format date appropriately
  },
  // Add other columns as needed
];

interface ApplicationsTableProps {
  applications: Application[];
}

export const ApplicationsTable = async ({
  applications,
}: ApplicationsTableProps) => {
  // const { data, error } = api.application.getAllByOpportunityId.useQuery({
  //   opportunityId: opportunity_id,
  // });

  const table = useReactTable({
    data: applications,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

"use client";
import React from "react";
import { type Application } from "@prisma/client";
import {
  type ColumnDef,
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
import { useRouter } from "next/navigation";

export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "id",
    header: () => "ID",
  },
  {
    accessorKey: "createdAt",
    header: () => "Created At",
  },
];

interface ApplicationsTableProps {
  applications: Application[];
}

export const ApplicationsTable = ({ applications }: ApplicationsTableProps) => {
  const table = useReactTable({
    data: applications,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const router = useRouter();

  const handleRowClick = (applicationId: string) => {
    router.push(`/opportunities/1/review/${applicationId}`);
  };

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
            // Use onClick event handler to navigate
            <TableRow
              key={row.id}
              onClick={() => handleRowClick(row.original.id.toString())}
              style={{ cursor: "pointer" }}
            >
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

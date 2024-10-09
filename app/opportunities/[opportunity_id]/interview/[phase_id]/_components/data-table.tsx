"use client";

import { Button } from "@components/ui/button";
import { DataTablePagination } from "@components/ui/data-table-pagination";
import { Input } from "@components/ui/input";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
  type SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { useMemo, useState } from "react";
import { type PhaseApplication } from "../page";
import { QuestionnaireCombobox } from "./questionnaireCombobox";
import type { Application, Questionnaire } from "@prisma/client";
import { UserMinus, UserPlus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  questionnaires: Questionnaire[];
  assignToQuestionnaire: (
    isAdd: boolean,
    applicationIds: Application["id"][],
    questionnaireId: Questionnaire["id"],
  ) => Promise<void>;
}

export function DataTable<TValue>({
  columns,
  data,
  questionnaires,
  assignToQuestionnaire,
}: DataTableProps<PhaseApplication, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      sorting,
      rowSelection,
    },
  });

  const [selectedQuestionnaireId, setSelectedQuestionnaireId] =
    useState<string>("");
  const selectedQuestionnaire = useMemo(() => {
    if (!selectedQuestionnaireId) return undefined;
    return questionnaires.find((q) => q.id === selectedQuestionnaireId);
  }, [selectedQuestionnaireId]);

  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter by name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {!!table.getFilteredSelectedRowModel().rows.length && (
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <QuestionnaireCombobox
                questionnaires={questionnaires.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                valueState={[
                  selectedQuestionnaireId,
                  setSelectedQuestionnaireId,
                ]}
              />
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    variant="outline"
                    disabled={!selectedQuestionnaireId.length}
                    onClick={async () => {
                      const applicationIds = table
                        .getFilteredSelectedRowModel()
                        .rows.map((row) => row.original.id);
                      const toastId = toast.loading(
                        `Assigning ${applicationIds.length} to questionnire ${selectedQuestionnaire?.name}`,
                      );
                      try {
                        await assignToQuestionnaire(
                          true,
                          applicationIds,
                          selectedQuestionnaireId,
                        );
                        toast.success(
                          `Assigned ${applicationIds.length} to ${selectedQuestionnaire?.name}`,
                          {
                            id: toastId,
                          },
                        );
                        router.refresh();
                      } catch (err) {
                        toast.error("Failed to assign", {
                          id: toastId,
                        });
                      }
                    }}
                  >
                    <UserPlus />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Add {table.getFilteredSelectedRowModel().rows.length}{" "}
                    applications to questionnaire{" "}
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    variant="outline"
                    disabled={!selectedQuestionnaireId.length}
                    onClick={async () => {
                      const applicationIds = table
                        .getFilteredSelectedRowModel()
                        .rows.map((row) => row.original.id);
                      const toastId = toast.loading(
                        `Removing ${applicationIds.length} from questionnaire ${selectedQuestionnaire?.name}`,
                      );
                      try {
                        await assignToQuestionnaire(
                          true,
                          applicationIds,
                          selectedQuestionnaireId,
                        );
                        toast.success(
                          `Removed ${applicationIds.length} from ${selectedQuestionnaire?.name}`,
                          {
                            id: toastId,
                          },
                        );
                        router.refresh();
                      } catch (err) {
                        toast.error("Failed to remove", {
                          id: toastId,
                        });
                      }
                    }}
                  >
                    <UserMinus />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Remove {table.getFilteredSelectedRowModel().rows.length}{" "}
                    applications from questionnaire{" "}
                    {
                      questionnaires.find(
                        (q) => q.id === selectedQuestionnaireId,
                      )?.name
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
      </div>

      {!!table.getFilteredSelectedRowModel().rows.length && (
        <div>
          <p className="text-lg font-medium">Selected applications:</p>
          {table
            .getFilteredSelectedRowModel()
            .rows.map((application) => `${application.original?.name}`)
            .join(", ")}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { DataTableViewOptions } from "./DataTableViewOptions";

import { ColumnDefs, ExtendedColumnDef, RowType } from "./DataTableTypes";


interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  columnDefs: ColumnDefs;
}

export function DataTableToolbar<TData>({
  table,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  columnDefs,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
      <div
        className="flex flex-1 flex-wrap items-center gap-2"
        style={{ maxWidth: "100%" }}
      >
        <Input
          placeholder={`Filter ${(table.getColumn("user_name")?.columnDef as ExtendedColumnDef<RowType, unknown>).label}...`}
          value={(table.getColumn("user_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("user_name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[150px] lg:w-[250px]"
        />
        <Input
          placeholder={`Filter ${(table.getColumn("questionnaire_phase.name")?.columnDef as ExtendedColumnDef<RowType, unknown>).label}...`}
          value={(table.getColumn("questionnaire_phase.name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("questionnaire_phase.name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[150px] lg:w-[250px]"
        />
        <Input
          placeholder={`Filter ${(table.getColumn("questionnaire_name")?.columnDef as ExtendedColumnDef<RowType, unknown>).label}...`}
          value={(table.getColumn("questionnaire_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("questionnaire_name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[150px] lg:w-[250px]"
        />
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

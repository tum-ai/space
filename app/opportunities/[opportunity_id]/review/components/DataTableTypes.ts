import { ColumnDef } from "@tanstack/react-table";
import {
  Application,
  Questionnaire,
  Review as PrismaReview,
  Phase,
} from "@prisma/client";

export type ExtendedColumnDef<TData, TUnknown> = ColumnDef<TData, TUnknown> & {
  label: string;
};

export interface Option {
  label: string | number;
  value: string | number;
}

export type RowType = PrismaReview & {
  application: Application;
} & { questionnaire: Questionnaire & { phase: Phase } } & {
  user: { name: string | null };
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ColumnDefs {}

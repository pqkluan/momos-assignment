import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { PageProperty } from "./notion";

export type TableRow = {
  [key: string]: PageProperty;
};

export type TableColumn = AccessorKeyColumnDef<TableRow, PageProperty>;

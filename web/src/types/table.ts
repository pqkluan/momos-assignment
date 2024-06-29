import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { PropertyPayload } from "./notion";

export type TableRow = {
  [key: string]: PropertyPayload | string;
};

export type TableColumn = AccessorKeyColumnDef<TableRow, PropertyPayload>;

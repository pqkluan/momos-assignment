import { PropertyPayload } from "./notion";

export type TableRowData = {
  [key: string]: PropertyPayload | string;
};

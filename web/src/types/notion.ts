import {
  DatabaseObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

// Notion don't expose the type of the properties, so we need to extract them ourselves

export type DatabaseProperty = DatabaseObjectResponse["properties"][string];
export type PageProperty = PageObjectResponse["properties"][string];

// We only support these property types, based on the assignment requirements
export type SupportedPropertyType =
  | "date"
  | "rich_text"
  | "number"
  | "select"
  | "status"
  | "multi_select"
  | "checkbox";

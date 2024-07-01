import {
  DatabaseObjectResponse,
  PageObjectResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";

// Notion don't expose the type of the properties, so we need to extract them ourselves

export type DatabaseProperties = DatabaseObjectResponse["properties"];
export type DatabaseProperty = DatabaseProperties[string];
export type PageProperties = PageObjectResponse["properties"];
export type PageProperty = PageProperties[string];

export type QueryRequestParams = Omit<QueryDatabaseParameters, "database_id">;
export type QueryRequestFilterParam = QueryRequestParams["filter"];

// We only support these property types, based on the assignment requirements
export type SupportedPropertyType =
  | "date"
  | "rich_text"
  | "number"
  | "select"
  | "status"
  | "multi_select"
  | "checkbox"
  | "created_time"
  | "last_edited_time";

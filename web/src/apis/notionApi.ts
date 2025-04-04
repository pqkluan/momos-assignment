import {
  DatabaseObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { QueryRequestParams } from "../types/notion";

const API_ENDPOINT = "http://localhost:8000";

export const notionApi = {
  retrieve: async () => {
    const response = await fetch(`${API_ENDPOINT}/notion/retrieve`);
    const body = await response.json();
    return body as DatabaseObjectResponse;
  },
  query: async (params: QueryRequestParams) => {
    const response = await fetch(`${API_ENDPOINT}/notion/query`, {
      method: "POST",
      body: JSON.stringify(params),
    });
    const body = await response.json();
    return body as PageObjectResponse[];
  },
};

import {
  GetDatabaseResponse,
  PageObjectResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";

type RequestParams = Omit<QueryDatabaseParameters, "database_id">;

const API_ENDPOINT = "http://localhost:8000";

export const notionApi = {
  retrieve: async () => {
    const response = await fetch(`${API_ENDPOINT}/notion/retrieve`);
    const body = await response.json();
    return body as GetDatabaseResponse;
  },
  query: async (params: RequestParams) => {
    const response = await fetch(`${API_ENDPOINT}/notion/query`, {
      method: "POST",
      body: JSON.stringify(params),
    });
    const body = await response.json();
    return body as PageObjectResponse[];
  },
};

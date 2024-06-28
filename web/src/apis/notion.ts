import {
  PageObjectResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";

type RequestParams = Omit<QueryDatabaseParameters, "database_id">;

const API_ENDPOINT = "http://localhost:8000/";

export const notionApi = {
  queryDb: async (params: RequestParams) => {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(params),
    });
    const body = await response.json();
    return body as PageObjectResponse[];
  },
};

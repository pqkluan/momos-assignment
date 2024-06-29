import http from "http";

import {
  DatabaseObjectResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";

import { NOTION_DB_ID } from "../env";
import { notion } from "../notionClient";

type RequestParams = Omit<QueryDatabaseParameters, "database_id">;

export function handleNotionQuery(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  if (req.method !== "POST") {
    res.writeHead(405);
    res.end(JSON.stringify({ error: "405 Method Not Allowed" }));
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      if (!NOTION_DB_ID) throw Error("ENV NOTION_DB_ID is not defined");

      // Kind of risky to parse the body without checking if it's valid JSON first, don't do this in production code.
      const queryParams = JSON.parse(body) as RequestParams;
      console.log(
        "handleNotionQuery params",
        JSON.stringify(queryParams, null, 2)
      );

      const queryResponse = await notion.databases.query({
        database_id: NOTION_DB_ID,
        ...queryParams,
      });

      // Since we don't know what kind of data we will get back from the database, we just dump all of it to the frontend.
      const list = queryResponse.results as DatabaseObjectResponse[];

      res.writeHead(200);
      res.end(JSON.stringify(list));
    } catch (error) {
      console.error("Failed to query notion database", error);
      res.writeHead(500);
      res.end();
    }
  });
}

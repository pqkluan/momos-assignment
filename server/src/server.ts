require("dotenv").config();

import http from "http";
import { Client } from "@notionhq/client";

import { HOST, PORT, NOTION_DB_ID, NOTION_SECRET } from "./env";
import {
  DatabaseObjectResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";

if (!NOTION_SECRET) throw Error("ENV NOTION_SECRET is not defined");

const notion = new Client({ auth: NOTION_SECRET });

type RequestParams = Omit<QueryDatabaseParameters, "database_id">;

// Require an async function here to support await with the DB query
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  if (req.url !== "/" || req.method !== "POST") {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Resource not found" }));
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      if (!NOTION_DB_ID) throw Error("ENV NOTION_DB_ID is not defined");

      // Kind of risky to parse the body without checking if it's valid JSON first, don't do this in production code.
      const params = JSON.parse(body) as RequestParams;
      console.log("Request params: ", params);

      const query = await notion.databases.query({
        database_id: NOTION_DB_ID,
        ...params,
      });

      // Since we don't know what kind of data we will get back from the database, we just dump all of it to the frontend.
      const list = query.results as DatabaseObjectResponse[];

      res.writeHead(200);
      res.end(JSON.stringify(list));
    } catch (error) {
      console.error("Failed to fetch notion data", error);
      res.writeHead(500);
      res.end();
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

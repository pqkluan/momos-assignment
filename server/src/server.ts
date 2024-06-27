require("dotenv").config();

import http from "http";
import { Client } from "@notionhq/client";

import { HOST, PORT, NOTION_DB_ID, NOTION_SECRET } from "./env";
import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";

if (!NOTION_SECRET) throw Error("ENV NOTION_SECRET is not defined");

const notion = new Client({ auth: NOTION_SECRET });

// Require an async function here to support await with the DB query
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  switch (req.url) {
    case "/": {
      if (!NOTION_DB_ID) throw Error("ENV NOTION_DB_ID is not defined");

      const query = await notion.databases.query({ database_id: NOTION_DB_ID });

      // Since we don't know what kind of data we will get back from the database, we just dump all of it to the frontend.
      const list = query.results as DatabaseObjectResponse[];

      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(JSON.stringify(list));

      break;
    }
    default: {
      res.setHeader("Content-Type", "application/json");
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Resource not found" }));
    }
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

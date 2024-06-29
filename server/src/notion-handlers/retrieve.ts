import http from "http";

import { NOTION_DB_ID } from "../env";
import { notion } from "../notionClient";

export async function handleNotionRetrieve(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  if (req.method !== "GET") {
    res.writeHead(405);
    res.end(JSON.stringify({ error: "405 Method Not Allowed" }));
  }

  try {
    if (!NOTION_DB_ID) throw Error("ENV NOTION_DB_ID is not defined");

    // Kind of risky to parse the body without checking if it's valid JSON first, don't do this in production code.

    const retrieveResponse = await notion.databases.retrieve({
      database_id: NOTION_DB_ID,
    });

    res.writeHead(200);
    res.end(JSON.stringify(retrieveResponse));
  } catch (error) {
    console.error("Failed to retrieve notion database", error);
    res.writeHead(500);
    res.end();
  }
}

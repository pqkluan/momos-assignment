require("dotenv").config();

import http from "http";

import { HOST, PORT, NOTION_SECRET } from "./env";
import { handleNotionQuery } from "./notion-handlers/query";
import { handleNotionRetrieve } from "./notion-handlers/retrieve";

if (!NOTION_SECRET) throw Error("ENV NOTION_SECRET is not defined");

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  switch (req.url) {
    case "/notion/retrieve": {
      await handleNotionRetrieve(req, res);
      break;
    }
    case "/notion/query": {
      handleNotionQuery(req, res);
      break;
    }
    default:
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Resource not found" }));
      return;
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

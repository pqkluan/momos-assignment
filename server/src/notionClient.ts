import { Client } from "@notionhq/client";

import { NOTION_SECRET } from "./env";
if (!NOTION_SECRET) throw Error("ENV NOTION_SECRET is not defined");

export const notion = new Client({ auth: NOTION_SECRET });

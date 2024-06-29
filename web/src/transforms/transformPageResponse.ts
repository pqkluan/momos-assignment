import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { TableRow } from "../types/table";
import { PageProperty } from "../types/notion";
import { isSupportPropertyType } from "../utils/isSupportPropertyType";

export const transformPageResponse = (
  data: PageObjectResponse[]
): TableRow[] => {
  return data.map((item) => {
    const dto: TableRow = {};

    for (const key in item.properties) {
      const property = item.properties[key];

      if (isSupportPropertyType(property.type)) {
        dto[key] = property as PageProperty;
      }
    }

    return dto;
  });
};

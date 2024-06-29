import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { TableRow } from "../types/table";
import { PropertyPayload, SupportedPropertyType } from "../types/notion";

const supportMaps: Record<SupportedPropertyType, true> = {
  checkbox: true,
  date: true,
  multi_select: true,
  number: true,
  rich_text: true,
  select: true,
  status: true,
};

// This will ensure that the supportedTypes array is always in sync with the SupportedPropertyType type
const supportedTypes = Object.keys(supportMaps);

export const transformPageResponse = (
  data: PageObjectResponse[]
): TableRow[] => {
  // TODO: use zod to validate the data

  return data.map((item) => {
    const { id, properties } = item;
    const dto: TableRow = { id };

    for (const key in properties) {
      const property = properties[key];
      const { type } = property;

      if (supportedTypes.includes(type)) {
        dto[key] = property as PropertyPayload;
      }
    }

    return dto;
  });
};

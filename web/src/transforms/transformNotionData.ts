import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import {
  PropertyPayload,
  SupportedPropertyType,
} from "../services/notion/types";

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

export type NotionDataRow = {
  [key: string]: PropertyPayload | string;
};

export const transformNotionData = (
  data: PageObjectResponse[]
): NotionDataRow[] => {
  // TODO: use zod to validate the data

  return data.map((item) => {
    const { id, properties } = item;
    const dto: NotionDataRow = { id };

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

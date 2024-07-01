import { SupportedPropertyType } from "../types/notion";

const supportMaps: Record<SupportedPropertyType, true> = {
  checkbox: true,
  date: true,
  multi_select: true,
  number: true,
  rich_text: true,
  select: true,
  status: true,
  created_time: true,
  last_edited_time: true,
};

// This will ensure that the supportedTypes array is always in sync with the SupportedPropertyType type
const supportedTypes = Object.keys(supportMaps);

export function isSupportPropertyType(
  type: string
): type is SupportedPropertyType {
  return supportedTypes.includes(type);
}

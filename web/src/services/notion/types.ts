/**
 * This file contains the payload types that are returned by the Notion API for the properties of a page.
 * Not all property types are supported by this application, so only the supported types are defined here.
 */

export type PropertyNumber = {
  id: string;
  type: "number";
  number: number;
};

export type PropertySelect = {
  id: string;
  type: "select";
  select: {
    id: string;
    name: string;
    color: string;
  };
};

export type PropertyRichText = {
  id: string;
  type: "rich_text";
  rich_text: {
    type: "text";
    text: {
      content: string;
      link: string | null;
    };
    annotations: {
      bold: boolean;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
      code: boolean;
      color: string;
    };
    plain_text: string;
    href: string | null;
  }[];
};

export type PropertyStatus = {
  id: string;
  type: "status";
  status: {
    id: string;
    name: string;
    color: string;
  };
};

export type PropertyMultipleSelect = {
  id: string;
  type: "multi_select";
  multi_select: {
    id: string;
    name: string;
    color: string;
  }[];
};

export type PropertyCheckbox = {
  id: string;
  type: "checkbox";
  checkbox: boolean;
};

export type PropertyDate = {
  id: string;
  type: "date";
  date: {
    end: null;
    start: string;
    time_zone: null;
  } | null;
};

export type PropertyPayload =
  | PropertyNumber
  | PropertySelect
  | PropertyRichText
  | PropertyStatus
  | PropertyMultipleSelect
  | PropertyCheckbox
  | PropertyDate;

export type SupportedPropertyType = PropertyPayload["type"];

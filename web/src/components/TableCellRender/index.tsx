import { CellContext } from "@tanstack/react-table";
import { FC } from "react";

import { DatabaseProperty, PageProperty } from "../../types/notion";
import { TableRow } from "../../types/table";

import styles from "./index.module.css";

export const TableCellRender: FC<CellContext<TableRow, PageProperty>> = (
  info
) => {
  const value = info.getValue();
  // This cell don't have a value, this usually happen when the data type is filtered out and mis-match with the column type
  if (value === undefined) return <div />;

  const meta = info.column.columnDef.meta as DatabaseProperty;

  if (meta.type === "checkbox" && value.type === "checkbox") {
    return <input type="checkbox" checked={value.checkbox} readOnly />;
  }

  if (meta.type === "status" && value.type === "status") {
    return (
      <span
        className={styles.chip}
        style={{ backgroundColor: value.status?.color }}
      >
        {value.status?.name}
      </span>
    );
  }

  if (meta.type === "select" && value.type === "select") {
    return (
      <span
        className={styles.chip}
        style={{ backgroundColor: value.select?.color }}
      >
        {value.select?.name}
      </span>
    );
  }

  if (meta.type === "multi_select" && value.type === "multi_select") {
    return (
      <span>
        {value.multi_select.map((e) => (
          <span
            key={e.id}
            className={styles.chip}
            style={{ backgroundColor: e.color }}
          >
            {e.name}
          </span>
        ))}
      </span>
    );
  }

  if (meta.type === "number" && value.type === "number") {
    if (typeof value.number !== "number") return <div />;

    // We could format the number with the meta.number.format
    // But it too much works to convert notion "format" to a valid number format. Eg. "dollar" to "$"
    // So just leave out the formatting for now
    return (
      <span>
        {[
          new Intl.NumberFormat("en-GB").format(value.number),
          meta.number.format,
        ].join(" ")}
      </span>
    );
  }

  if (meta.type === "date" && value.type === "date") {
    if (!value.date) return <div />;

    const { start, end } = value.date;
    return (
      <span>
        {[start, end]
          .filter((e): e is string => !!e)
          .map((d) => new Date(d).toLocaleDateString("en-GB"))
          .join(" - ")}
      </span>
    );
  }

  if (meta.type === "rich_text" && value.type === "rich_text") {
    return <span>{value.rich_text.map((e) => e.plain_text).join(", ")}</span>;
  }

  console.warn(`Unsupported type: ${value}`);
  return <span>{"?"}</span>;
};

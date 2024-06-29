import { createColumnHelper } from "@tanstack/react-table";
import { useMemo, useRef } from "react";

import { TableColumn, TableRow } from "../types/table";

const columnHelper = createColumnHelper<TableRow>();

/**
 * Generate columns based on the first row of the data.
 */
export function useDynamicColumns(data?: TableRow[]): TableColumn[] {
  const firstRow = data?.[0];

  const prevColumns = useRef<TableColumn[]>([]);

  return useMemo<TableColumn[]>(() => {
    // Return the previous columns in case of data changed when fetching.
    if (!firstRow) return prevColumns.current;

    const columns = Object.entries(firstRow).reduce<TableColumn[]>(
      (acc, pair) => {
        const [key, value] = pair;

        // We don't want to render the id column
        if (key === "id") return acc;
        // Nor any string property, because Notion don't return plain string
        if (typeof value === "string") return acc;

        acc.push(
          columnHelper.accessor(key, {
            header: () => key,
            cell: (info) => {
              const value = info.getValue();

              switch (value.type) {
                case "checkbox": {
                  return (
                    <input type="checkbox" checked={value.checkbox} readOnly />
                  );
                }
                case "date": {
                  if (!value.date) return null;
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
                case "multi_select": {
                  return (
                    <span>
                      {value.multi_select.map((e) => e.name).join(", ")}
                    </span>
                  );
                }
                case "number": {
                  return <span>{value.number}</span>;
                }
                case "rich_text": {
                  return (
                    <span>
                      {value.rich_text.map((e) => e.text.content).join(", ")}
                    </span>
                  );
                }
                case "select": {
                  return <span>{value.select.name}</span>;
                }
                case "status": {
                  return <span>{value.status.name}</span>;
                }
                default: {
                  console.warn(`Unsupported type: ${value}`);
                  return <span>{"Unsupported"}</span>;
                }
              }
            },
          })
        );

        return acc;
      },
      []
    );

    prevColumns.current = columns;

    return columns;
  }, [firstRow]);
}

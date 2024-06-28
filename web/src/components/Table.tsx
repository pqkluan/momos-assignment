import { FC, useMemo, useRef } from "react";
import {
  AccessorKeyColumnDef,
  OnChangeFn,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { TableRowData } from "../types/table";
import { PropertyPayload } from "../types/notion";
import styles from "./Table.module.css";
import { TableRow } from "./TableRow";
import { TableHeader } from "./TableHeader";

const columnHelper = createColumnHelper<TableRowData>();

type TableProps = {
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
  data: TableRowData[];
};

export const Table: FC<TableProps> = (props) => {
  const { data, sorting, setSorting } = props;

  const columns = useDynamicColumns(data);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
  });

  const { getHeaderGroups } = table;

  return (
    <table className={styles.table}>
      <thead>
        {getHeaderGroups().map(({ id: groupId, headers }) => (
          <tr key={groupId}>
            {headers.map(({ id: headerId, column, getContext }) => (
              <TableHeader
                key={headerId}
                onToggleSort={() => column.toggleSorting()}
                sort={column.getIsSorted() || undefined}
              >
                {flexRender(column.columnDef.header, getContext())}
              </TableHeader>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} row={row} />
        ))}
      </tbody>
    </table>
  );
};

type Column = AccessorKeyColumnDef<TableRowData, PropertyPayload>;

/**
 * Generate columns based on the first row of the data.
 */
function useDynamicColumns(data: TableRowData[]) {
  const firstRow = data[0];

  const prevColumns = useRef<Column[]>([]);

  return useMemo<Column[]>(() => {
    // Return the previous columns in case of data changed when fetching.
    if (!firstRow) return prevColumns.current;

    const columns = Object.entries(firstRow).reduce<Column[]>((acc, pair) => {
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
    }, []);

    prevColumns.current = columns;

    return columns;
  }, [firstRow]);
}

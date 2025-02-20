import {
  OnChangeFn,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FC, useState } from "react";

import { TableColumn, TableRow } from "../../types/table";

import { TableCell } from "../TableCell";
import { TableHeader } from "../TableHeader";

import styles from "./index.module.css";
import { TableDndContext } from "./TableDndContext";
import { TableRowDndContext } from "./TableRowDndContext";

type Props = {
  isLoading: boolean;
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;

  /**
   * Data could be undefined when (re)fetching data.
   */
  data?: TableRow[];
  columns: TableColumn[];
};

const defaultData: TableRow[] = [];

export const Table: FC<Props> = (props) => {
  const { isLoading, data = defaultData, columns, sorting, setSorting } = props;

  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    columns.map((c) => String(c.accessorKey))
  );

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: "onChange",
    state: { sorting, columnOrder },
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
  });

  const rows = table.getRowModel().rows;

  return (
    <TableDndContext setColumnOrder={setColumnOrder}>
      <div
        style={{
          overflowX: "auto",
          direction: table.options.columnResizeDirection,
        }}
      >
        <table
          className={styles.table}
          style={{ width: table.getCenterTotalSize() }}
        >
          <thead>
            {table.getHeaderGroups().map(({ id: groupId, headers }) => (
              <tr key={groupId}>
                <TableRowDndContext columnOrder={columnOrder}>
                  {headers.map((header) => (
                    <TableHeader key={header.id} header={header} />
                  ))}
                </TableRowDndContext>
              </tr>
            ))}
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <TableRowDndContext columnOrder={columnOrder}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} cell={cell} />
                  ))}
                </TableRowDndContext>
              </tr>
            ))}

            {isLoading ? (
              <Loading noOfColumns={columns.length} />
            ) : rows.length === 0 ? (
              <Empty noOfColumns={columns.length} />
            ) : null}
          </tbody>
        </table>
      </div>
    </TableDndContext>
  );
};

const Loading: FC<{ noOfColumns: number }> = (props) => (
  <tr>
    <td colSpan={props.noOfColumns} style={{ textAlign: "center" }}>
      {"Loading ..."}
    </td>
  </tr>
);

const Empty: FC<{ noOfColumns: number }> = (props) => (
  <tr>
    <td colSpan={props.noOfColumns} style={{ textAlign: "center" }}>
      {"No data found."}
    </td>
  </tr>
);

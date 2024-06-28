import {
  OnChangeFn,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FC } from "react";

import { TableRowData } from "../types/table";
import styles from "./Table.module.css";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { useDynamicColumns } from "./useDynamicColumns";

type TableProps = {
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
  data?: TableRowData[];
};

export const Table: FC<TableProps> = (props) => {
  const { data = [], sorting, setSorting } = props;

  const columns = useDynamicColumns(data);

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: "onChange",
    state: { sorting },
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
  });

  const { getHeaderGroups } = table;
  const rows = table.getRowModel().rows;

  return (
    <div style={{ direction: table.options.columnResizeDirection }}>
      <div style={{ overflowX: "auto" }}>
        <table
          className={styles.table}
          style={{ width: table.getCenterTotalSize() }}
        >
          <thead>
            {getHeaderGroups().map(({ id: groupId, headers }) => (
              <tr key={groupId}>
                {headers.map((header) => (
                  <TableHeader key={header.id} header={header} />
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {rows.length === 0 && <Loading noOfColumns={columns.length} />}

            {rows.map((row) => (
              <TableRow key={row.id} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Loading = (props: { noOfColumns: number }) => (
  <tr>
    <td colSpan={props.noOfColumns} style={{ textAlign: "center" }}>
      {"Loading ..."}
    </td>
  </tr>
);

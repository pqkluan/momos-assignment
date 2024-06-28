import { Row, flexRender } from "@tanstack/react-table";
import { FC } from "react";

import { TableRowData } from "../types/table";

type Props = {
  row: Row<TableRowData>;
};

export const TableRow: FC<Props> = (props) => {
  const { row } = props;

  return (
    <tr>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

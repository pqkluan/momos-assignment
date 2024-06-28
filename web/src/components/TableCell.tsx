import { CSSProperties } from "react";

import { Cell, flexRender } from "@tanstack/react-table";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import { TableRowData } from "../types/table";

type Props = {
  cell: Cell<TableRowData, unknown>;
};

export const TableCell = (props: Props) => {
  const { cell } = props;
  const { column, getContext } = cell;

  const { isDragging, setNodeRef, transform } = useSortable({
    id: column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    width: column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <td ref={setNodeRef} style={style}>
      {flexRender(column.columnDef.cell, getContext())}
    </td>
  );
};

import {
  IconArrowsSort,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { Header, SortDirection, flexRender } from "@tanstack/react-table";
import { FC, PropsWithChildren } from "react";

import { TableRowData } from "../types/table";
import styles from "./Table.module.css";

type Props = PropsWithChildren<{
  header: Header<TableRowData, unknown>;
}>;

export const TableHeader: FC<Props> = (props) => {
  const { header } = props;
  const {
    id: headerId,
    colSpan,
    column,
    getContext,
    getSize,
    getResizeHandler,
  } = header;

  const handleSort = (
    e: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>
  ) => {
    // Prevent sorting when clicking on the resizer
    if (e.currentTarget !== e.target) return;
    column.toggleSorting();
  };

  return (
    <th
      key={headerId}
      colSpan={colSpan}
      style={{ width: getSize() }}
      onClick={handleSort}
    >
      {flexRender(column.columnDef.header, getContext())}

      <SortIcon sort={column.getIsSorted()} />

      <div
        className={[
          styles.resizer,
          column.getIsResizing() ? styles.resizerActive : undefined,
        ]
          .filter((e): e is string => !!e)
          .join(" ")}
        onDoubleClick={() => column.resetSize()}
        onMouseDown={getResizeHandler()}
        onTouchStart={getResizeHandler()}
      />
    </th>
  );
};

const SortIcon = (props: { sort: SortDirection | false }) => {
  const { sort } = props;
  switch (sort) {
    case "asc": {
      return <IconSortAscending className={styles.sortIcon} size={14} />;
    }
    case "desc": {
      return <IconSortDescending className={styles.sortIcon} size={14} />;
    }
    default: {
      return <IconArrowsSort className={styles.sortIcon} size={14} />;
    }
  }
};

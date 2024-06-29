import { CSSProperties, FC, PropsWithChildren } from "react";

import {
  IconArrowsSort,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { Header, SortDirection, flexRender } from "@tanstack/react-table";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import { TableRow } from "../types/table";
import styles from "./Table.module.css";

type Props = PropsWithChildren<{
  header: Header<TableRow, unknown>;
}>;

export const TableHeader: FC<Props> = (props) => {
  const { header } = props;
  const {
    colSpan,
    column,
    isPlaceholder,
    getContext,
    getSize,
    getResizeHandler,
  } = header;

  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({ id: column.id });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <th ref={setNodeRef} colSpan={colSpan} style={style}>
      <div style={{ display: "flex" }} {...attributes} {...listeners}>
        {isPlaceholder
          ? null
          : flexRender(column.columnDef.header, getContext())}

        <SortButton
          sort={column.getIsSorted()}
          toggleSorting={column.toggleSorting}
        />
      </div>

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

const SortButton = (props: {
  sort: SortDirection | false;
  toggleSorting: () => void;
}) => {
  const { sort, toggleSorting } = props;

  const handleSort = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent sorting when clicking on the resizer
    // if (e.currentTarget !== e.target) return;
    toggleSorting();
  };

  const Icon = (() => {
    if (sort === "asc") return IconSortAscending;
    if (sort === "desc") return IconSortDescending;
    return IconArrowsSort;
  })();

  // return <Icon className={styles.sortIcon} size={14} onClick={handleSort} />;
  return (
    <span onClick={handleSort}>
      <Icon className={styles.sortIcon} size={14} />
    </span>
  );
};

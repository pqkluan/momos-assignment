import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { SortDirection } from "@tanstack/react-table";
import { FC, PropsWithChildren } from "react";

import styles from "./Table.module.css";

type Props = PropsWithChildren<{
  sort?: SortDirection;
  onToggleSort: () => void;
}>;

export const TableHeader: FC<Props> = (props) => {
  const { children, sort, onToggleSort } = props;

  return (
    <th onClick={onToggleSort}>
      {children}

      {sort === "asc" ? (
        <IconArrowDown className={styles.sortIcon} size={14} />
      ) : null}

      {sort === "desc" ? (
        <IconArrowUp className={styles.sortIcon} size={14} />
      ) : null}
    </th>
  );
};

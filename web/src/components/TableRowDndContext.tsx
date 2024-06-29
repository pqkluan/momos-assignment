import { FC, PropsWithChildren } from "react";

import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

type Props = PropsWithChildren<{
  columnOrder: string[];
}>;

export const TableRowDndContext: FC<Props> = (props) => {
  const { columnOrder, children } = props;

  return (
    <SortableContext
      items={columnOrder}
      strategy={horizontalListSortingStrategy}
    >
      {children}
    </SortableContext>
  );
};

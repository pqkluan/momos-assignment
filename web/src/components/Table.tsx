import { FC, useState } from "react";
import {
  OnChangeFn,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { TableRowData } from "../types/table";
import styles from "./Table.module.css";
import { TableHeader } from "./TableHeader";
import { TableCell } from "./TableCell";
import { useDynamicColumns } from "./useDynamicColumns";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

type TableProps = {
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
  data?: TableRowData[];
};

const defaultData: TableRowData[] = [];

export const Table: FC<TableProps> = (props) => {
  const { data = defaultData, sorting, setSorting } = props;

  const columns = useDynamicColumns(data);
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

  const { getHeaderGroups } = table;
  const rows = table.getRowModel().rows;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex);
      });
    }
  }

  const sensors = useSensors(
    // Important: prevent dragging when clicking on the sort button
    useSensor(MouseSensor, { activationConstraint: { distance: 0.1 } }),
    useSensor(TouchSensor, {})
  );

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
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
            {getHeaderGroups().map(({ id: groupId, headers }) => (
              <tr key={groupId}>
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {headers.map((header) => (
                    <TableHeader key={header.id} header={header} />
                  ))}
                </SortableContext>
              </tr>
            ))}
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <SortableContext
                    key={cell.id}
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    <TableCell key={cell.id} cell={cell} />
                  </SortableContext>
                ))}
              </tr>
            ))}

            {rows.length === 0 && <Loading noOfColumns={columns.length} />}
          </tbody>
        </table>
      </div>
    </DndContext>
  );
};

const Loading = (props: { noOfColumns: number }) => (
  <tr>
    <td colSpan={props.noOfColumns} style={{ textAlign: "center" }}>
      {"Loading ..."}
    </td>
  </tr>
);

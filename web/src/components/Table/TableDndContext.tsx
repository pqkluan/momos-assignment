import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useCallback,
} from "react";

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { arrayMove } from "@dnd-kit/sortable";

type Props = PropsWithChildren<{
  setColumnOrder: Dispatch<SetStateAction<string[]>>;
}>;

export const TableDndContext: FC<Props> = (props) => {
  const { setColumnOrder } = props;

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!active) return;
      if (!over) return;
      if (active.id === over.id) return;

      setColumnOrder((order) => {
        const from = order.indexOf(active.id as string);
        const to = order.indexOf(over.id as string);
        return arrayMove(order, from, to);
      });
    },
    [setColumnOrder]
  );

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
      {props.children}
    </DndContext>
  );
};

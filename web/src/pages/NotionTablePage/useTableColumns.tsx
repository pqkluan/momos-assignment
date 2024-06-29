import { useMemo, useRef } from "react";

import { createColumnHelper } from "@tanstack/react-table";
import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { TableCellRender } from "../../components/TableCellRender";
import { TableColumn, TableRow } from "../../types/table";
import { isSupportPropertyType } from "../../utils/isSupportPropertyType";

const columnHelper = createColumnHelper<TableRow>();

export function useTableColumns(
  response?: DatabaseObjectResponse
): TableColumn[] {
  const prevColumns = useRef<TableColumn[]>([]);

  return useMemo<TableColumn[]>(() => {
    if (!response) return prevColumns.current;

    const columns = Object.entries(response.properties).reduce<TableColumn[]>(
      (acc, pair) => {
        const [columnName, meta] = pair;

        if (isSupportPropertyType(meta.type)) {
          acc.push(
            columnHelper.accessor(columnName, {
              meta,
              header: () => columnName,
              cell: TableCellRender,
            })
          );
        }

        return acc;
      },
      []
    );

    prevColumns.current = columns;

    return columns;
  }, [response]);
}

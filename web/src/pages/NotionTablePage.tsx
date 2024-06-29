import { FC, useState } from "react";

import { SortingState } from "@tanstack/react-table";
import { notionApi } from "../apis/notion";
import { transformPageResponse } from "../transforms/transformPageResponse";
import { Table } from "../components/Table";
import { useQuery } from "@tanstack/react-query";
import { useDynamicColumns } from "../components/useDynamicColumns";

export const NotionTablePage: FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["notion", sorting],
    queryFn: () =>
      notionApi.queryDb({
        sorts: sorting.map((sort) => ({
          property: sort.id,
          direction: sort.desc ? "descending" : "ascending",
        })),
      }),
    select: (data) => transformPageResponse(data),
  });

  // Deprive columns from data
  const columns = useDynamicColumns(data);

  return (
    <div>
      <h1>{"Momos - Assignment"}</h1>

      {columns.length > 0 ? (
        <Table
          data={data}
          columns={columns}
          sorting={sorting}
          setSorting={setSorting}
        />
      ) : isLoading ? (
        <div>{"Loading..."}</div>
      ) : isError ? (
        <div>
          <p>{`An error has occurred ${error}`}</p>
          <button onClick={() => refetch()}>{"Retry"}</button>
        </div>
      ) : null}
    </div>
  );
};

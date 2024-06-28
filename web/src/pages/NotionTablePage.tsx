import { FC, useEffect, useState } from "react";

import { SortingState } from "@tanstack/react-table";
import { notionApi } from "../apis/notion";
import { transformPageResponse } from "../transforms/transformPageResponse";
import { Table } from "../components/Table";
import { useQuery } from "@tanstack/react-query";

export const NotionTablePage: FC = () => {
  const [initialized, setInitialized] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data } = useQuery({
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

  useEffect(() => {
    if (initialized) return;
    if (!Array.isArray(data)) return;
    setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div>
      <h1>{"Momos - Assignment"}</h1>
      {initialized ? (
        <Table data={data} sorting={sorting} setSorting={setSorting} />
      ) : (
        <div>{"Loading..."}</div>
      )}
    </div>
  );
};

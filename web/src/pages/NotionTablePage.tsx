import { FC, useState } from "react";

import { SortingState } from "@tanstack/react-table";
import { notionApi } from "../apis/notion";
import { transformPageResponse } from "../transforms/transformPageResponse";
import { Table } from "../components/Table";
import { useQuery } from "@tanstack/react-query";

export const NotionTablePage: FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["notion", sorting],
    queryFn: async () => {
      return notionApi.queryDb({
        sorts: sorting.map((sort) => ({
          property: sort.id,
          direction: sort.desc ? "descending" : "ascending",
        })),
      });
    },
    select: (data) => transformPageResponse(data),
  });

  // TODO: better UX for loading states

  return (
    <div>
      <h1>{"Momos - Assignment"}</h1>

      {isLoading ? (
        <div>{"Initial loading..."}</div>
      ) : (
        <Table data={data} sorting={sorting} setSorting={setSorting} />
      )}
    </div>
  );
};

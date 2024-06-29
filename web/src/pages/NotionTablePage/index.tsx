import { FC, Fragment, useState } from "react";

import { SortingState } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";

import { notionApi } from "../../apis/notionApi";
import { Table } from "../../components/Table";
import { TableColumn } from "../../types/table";
import { transformPageResponse } from "../../transforms/transformPageResponse";

import { useDynamicColumns } from "./useDynamicColumns";

export const NotionTablePage: FC = () => {
  const query = useQuery({
    queryKey: ["notion-retrieve"],
    queryFn: notionApi.retrieve,
  });

  // Create react table columns based on the database config
  const columns = useDynamicColumns(query.data);

  const title = query.data?.title?.[0]?.plain_text ?? "Momos - Assignment";

  return (
    <div>
      <h1>{title}</h1>

      {columns.length > 0 ? (
        <TableContent columns={columns} />
      ) : query.isLoading ? (
        <div>{"Fetching table information..."}</div>
      ) : query.isError ? (
        <Fragment>
          <p>{`An error has occurred ${query.error}`}</p>
          <button onClick={() => query.refetch()}>{"Retry"}</button>
        </Fragment>
      ) : null}
    </div>
  );
};

const TableContent: FC<{ columns: TableColumn[] }> = (props) => {
  const { columns } = props;

  const [sorting, setSorting] = useState<SortingState>([]);

  const query = useQuery({
    queryKey: ["notion-query", sorting],
    queryFn: () =>
      notionApi.query({
        sorts: sorting.map((sort) => ({
          property: sort.id,
          direction: sort.desc ? "descending" : "ascending",
        })),
      }),
    select: (data) => transformPageResponse(data),
  });

  return (
    <Fragment>
      {query.isError ? (
        <Fragment>
          <p>{`An error has occurred ${query.error}`}</p>
          <button onClick={() => query.refetch()}>{"Retry"}</button>
        </Fragment>
      ) : (
        <Fragment>
          <Table
            data={query.data}
            columns={columns}
            sorting={sorting}
            setSorting={setSorting}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

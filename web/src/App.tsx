import { FC, useCallback, useState } from "react";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { transformPageResponse } from "./transforms/transformPageResponse";
import { Table } from "./components/Table";
import { useDidMount } from "./hooks/useDidMount";
import { TableRowData } from "./types/table";

export const App: FC = () => {
  const [data, setData] = useState<TableRowData[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/");
      const payload = (await response.json()) as PageObjectResponse[];

      setData(transformPageResponse(payload));
    } catch (error) {
      console.error("Failed to fetch notion data", error);
    }
  }, []);

  useDidMount(() => {
    fetchData();
  });

  return (
    <div>
      <h1>{"Momos - Assignment"}</h1>
      {data.length > 0 ? <Table data={data} /> : null}
    </div>
  );
};

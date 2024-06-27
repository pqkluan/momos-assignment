import { useCallback, useState } from "react";
import { useDidMount } from "./hooks/useDidMount";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { SampleTable } from "./components/SampleTable";
import {
  NotionDataRow,
  transformNotionData,
} from "./transforms/transformNotionData";

// type RowData = {
//   id: string;
// 	properties:Record<string,
// };

function App() {
  const [data, setData] = useState<NotionDataRow[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/");
      const payload = (await response.json()) as PageObjectResponse[];

      setData(transformNotionData(payload));
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

      <SampleTable />

      {data.map((item, index) => (
        <div key={index}>
          <pre>{JSON.stringify(item, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}

export default App;

import { FC } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { NotionTablePage } from "./pages/NotionTablePage";

const queryClient = new QueryClient();

export const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NotionTablePage />
    </QueryClientProvider>
  );
};

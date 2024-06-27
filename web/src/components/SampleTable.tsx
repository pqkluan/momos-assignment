import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { FC, useState } from "react";

// Problem: We don't know the type of the data we're working with
type Dto = Record<string, unknown>;

const defaultData: Dto[] = [
  {
    firstName: "tanner",
    age: 24,
  },
  {
    firstName: "tandy",
    age: 40,
  },
  {
    firstName: "joe",
    age: 45,
  },
];

const columnHelper = createColumnHelper<Dto>();

const columns = [
  columnHelper.accessor("firstName", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("age", {
    header: () => "Age",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
];

export const SampleTable: FC = () => {
  const [data] = useState(() => [...defaultData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { getHeaderGroups } = table;

  return (
    <table>
      <thead>
        {getHeaderGroups().map(({ id: groupId, headers }) => (
          <tr key={groupId}>
            {headers.map(
              ({ id: headerId, isPlaceholder, column, getContext }) => (
                <th key={headerId}>
                  {isPlaceholder
                    ? null
                    : flexRender(column.columnDef.header, getContext())}
                </th>
              )
            )}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>

      <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  );
};

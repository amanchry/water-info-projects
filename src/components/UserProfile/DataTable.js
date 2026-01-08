import ReactDOM from "react-dom/client";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useReducer, useState } from "react";
import { Table, Flex, Box } from "@radix-ui/themes";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";

// import { makeData, Person } from './makeData'

//custom sorting logic for one of our enum columns
const sortStatusFn = (rowA, rowB, _columnId) => {
  const statusA = rowA.original.status;
  const statusB = rowB.original.status;
  const statusOrder = ["single", "complicated", "relationship"];
  return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
};

function DataTable() {
  const rerender = useReducer(() => ({}), {})[1];

  const [sorting, setSorting] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.name,
        id: "name",
        cell: (info) => (
          <Flex gap="2" align="center">
            {info.row.original.format === "SVG" ? (
              <Box as="span" className="icon-Iconsvg text-2xl" />
            ) : info.row.original.format === "JPG" ? (
              <Box as="span" className="icon-IconJPG text-2xl" />
            ) : (
              ""
            )}
            {info.getValue()}
          </Flex>
        ),
        header: () => <span>Name</span>,
        sortUndefined: "last", //force undefined values to the end
        sortDescFirst: false, //first sort order will be ascending (nullable values can mess up auto detection of sort order)
      },
      {
        accessorFn: (row) => row.date,
        id: "date",
        cell: (info) => info.getValue(),
        header: () => <span>Date</span>,
        sortUndefined: "last", //force undefined values to the end
        sortDescFirst: false, //first sort order will be ascending (nullable values can mess up auto detection of sort order)
      },
      {
        accessorFn: (row) => row.size,
        id: "size",
        cell: (info) => info.getValue(),
        header: () => <span>Size</span>,
        sortUndefined: "last", //force undefined values to the end
        sortDescFirst: false, //first sort order will be ascending (nullable values can mess up auto detection of sort order)
      },
      {
        accessorKey: "format",
        header: () => <span>Format</span>,
        sortUndefined: "last", //force undefined values to the end
      },
    ],
    []
  );

  const [data, setData] = useState([]);

  useEffect(() => {
    setData([
      {
        name: "Evapotranspiration_report_2018-203",
        date: "21 Jan 2025",
        size: "1.2MB",
        format: "SVG",
      },
      {
        name: "Evapotranspiration_report_2018-205",
        date: "21 Jan 2023",
        size: "1.2MB",
        format: "JPG",
      },
    ]);
  }, []);

  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    onSortingChange: setSorting, //optionally control sorting state in your own scope for easy access
    // sortingFns: {
    //   sortStatusFn, //or provide our custom sorting function globally for all columns to be able to use
    // },
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      sorting,
    },
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering - default on/true
    // enableMultiSort: false, //Don't allow shift key to sort multiple columns - default on/true
    // enableSorting: false, // - default on/true
    // enableSortingRemoval: false, //Don't allow - default on/true
    // isMultiSortEvent: (e) => true, //Make all clicks multi-sort - default requires `shift` key
    // maxMultiSortColCount: 3, // only allow 3 columns to be sorted at once - default is Infinity
  });

  //access sorting state from the table instance

  return (
    <>
      <Table.Root variant="surface">
        <Table.Header className="bg-[var(--gray-3)]">
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Table.ColumnHeaderCell
                    className="!font-light !text-sm"
                    key={header.id}
                    colSpan={header.colSpan}
                    // align={header.id === "name" ? "left" : "center"}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none flex gap-2 items-center"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === "asc"
                              ? "Sort ascending"
                              : header.column.getNextSortingOrder() === "desc"
                              ? "Sort descending"
                              : "Clear sort"
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ArrowUpIcon />,
                          desc: <ArrowDownIcon />,
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </Table.ColumnHeaderCell>
                );
              })}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table
            .getRowModel()
            .rows.map((row) => {
              return (
                <Table.Row key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Table.Cell
                        className="border-r border-[var(--gray-4)] last:border-0"
                        key={cell.id}
                        // align={cell.column.id === "name" ? "left" : "center"}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table.Root>
      {/* <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div> */}
      {/* <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <pre>{JSON.stringify(sorting, null, 2)}</pre> */}
    </>
  );
}

export default DataTable;

import React, { useMemo, useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";

import { useVirtualizer } from "@tanstack/react-virtual";
import {
  RES_MENU_GOTO_MON,
  RES_MENU_GOTO_QUEUE,
  RES_NO_DATA,
} from "@/data/dash/resources";
import TableContextMenu from "./tableContextMenu";
import { Tooltip as ReactTooltip } from "react-tooltip";

interface TableProps {
  tableOption: any;
  tableData: any[];
  rowClickHandler?: (row: any) => void;
  contextMenuOption?: any[];
  containerName?: string;
}

export default function DashReactTable(tableProps: TableProps) {
  const table = useReactTable({
    data: tableProps.tableData,
    columns: tableProps.tableOption.columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    defaultColumn: {
      size: 0,
      minSize: 0,
    },
  });
  const { rows } = table.getRowModel();

  //The virtualizer needs to know the scrollable container element
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => tableProps.tableOption.rowHeight ?? 40, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  const [contextMenu, setContextMenu] = useState<any>(null);
  const handleContextMenu = (event: any, row: any) => {
    if (!tableProps.contextMenuOption || !row) return;

    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            top: event.clientY - 6,
            left: event.clientX + 2,
            rowData: tableProps.tableData[row.index],
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };
  const handleRowClick = (event: any, row: any) => {
    if (!tableProps.rowClickHandler || !row) return;
    tableProps.rowClickHandler(tableProps.tableData[row.index]);
  };

  return (
    <div className="w-100 h-100">
      {!!contextMenu?.top && tableProps.contextMenuOption && (
        <TableContextMenu
          anchorPosition={{ top: contextMenu.top, left: contextMenu.left }}
          options={tableProps.contextMenuOption}
          handleClose={() => setContextMenu(null)}
          data={contextMenu?.rowData}
        />
      )}
      <ReactTooltip
        place="left"
        id="table-tooltip-id"
        variant="dark"
        className="dash-table-tooltip"
      />
      <div
        className={tableProps.containerName ?? "dash-table-container"}
        ref={tableContainerRef}
        style={{
          overflow: "auto", //our scrollable table container
          position: "relative", //needed for sticky header
          height:
            tableProps.tableOption?.height ?? null
              ? `${tableProps.tableOption.height}px`
              : "95%",
          minHeight:
            tableProps.tableOption.tableOption?.minHeight ?? null
              ? `${tableProps.tableOption.minHeight}px`
              : undefined,
        }}
      >
        {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
        <table style={{ display: "grid" }}>
          {tableProps.tableOption.headerVisible && (
            <thead
              style={{ display: "grid", position: "sticky", top: 0, zIndex: 1 }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  style={{
                    display: "flex",
                    width: "100%",
                    height: tableProps.tableOption.rowHeight
                      ? `${tableProps.tableOption.rowHeight}px`
                      : undefined,
                  }}
                >
                  {headerGroup.headers.map((header: any, index) => {
                    return (
                      <th
                        key={header.id}
                        style={{
                          display: "flex",
                          width:
                            header.getSize() > 0
                              ? `${header.getSize()}px`
                              : undefined,
                          minWidth:
                            header.getSize() > 0
                              ? `${header.getSize()}px`
                              : undefined,
                          flex: header.getSize() > 0 ? undefined : 1,
                          height: tableProps.tableOption.rowHeight
                            ? `${tableProps.tableOption.rowHeight}px`
                            : undefined,
                        }}
                        className={
                          tableProps.tableOption.alignColumns?.at(index) ??
                          "cell-content-left"
                        }
                      >
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: "  ▲", //' 🔼',
                            desc: "  ▼ ", // ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
          )}
          <tbody
            style={{
              display: "grid",
              height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
              position: "relative", //needed for absolute positioning of rows
            }}
          >
            {(!tableProps.tableData || tableProps.tableData.length === 0) &&
            tableProps.tableOption.enablePlaceholder !== false ? (
              <div className="place-holder"> {RES_NO_DATA} </div>
            ) : (
              rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index] as Row<any>;
                return (
                  <tr
                    data-index={virtualRow.index} //needed for dynamic row height measurement
                    ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                    key={row.id}
                    className={
                      tableProps.tableOption?.rowHover ? "hover-tr" : ""
                    }
                    style={{
                      display: "flex",
                      position: "absolute",
                      transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                      width: "100%",
                      height: tableProps.tableOption.rowHeight
                        ? `${tableProps.tableOption.rowHeight}px`
                        : undefined,
                    }}
                    onContextMenu={(event: any) =>
                      handleContextMenu(event, row)
                    }
                    onClick={(event: any) => handleRowClick(event, row)}
                  >
                    {row.getVisibleCells().map((cell: any, index) => {
                      return (
                        <td
                          key={cell.id}
                          style={{
                            display: "flex",
                            width:
                              cell.column.getSize() > 0
                                ? `${cell.column.getSize()}px`
                                : undefined,
                            minWidth:
                              cell.column.getSize() > 0
                                ? `${cell.column.getSize()}px`
                                : undefined,
                            flex: cell.column.getSize() > 0 ? undefined : 1,
                            height: tableProps.tableOption.rowHeight
                              ? `${tableProps.tableOption.rowHeight}px`
                              : undefined,
                          }}
                          className={
                            tableProps.tableOption.alignColumns?.at(index) ??
                            "cell-content-left"
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

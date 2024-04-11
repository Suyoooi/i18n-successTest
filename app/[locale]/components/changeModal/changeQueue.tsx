"use client";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hook/hook";
import axios from "axios";
import { setSelectedQueue } from "@/redux/slices/queue/queueSlice";
import { ColumnDefinition, ReactTabulator } from "react-tabulator";
import { CHANGE_OPTION } from "@/data/tabulator/options";
import { CellComponent, RowComponent } from "tabulator-tables";

const ChangeQueue: React.FC = () => {
  const selectedRow = useAppSelector((state) => state.isVpn.selectedRow);
  const selectedId = useAppSelector((state) => state.isVpn.selectedId);
  const selectedRowQueue = useAppSelector((state) => state.queue.selectedQueue);

  const msgVpns = selectedRow?.msgVpnName;
  const msgVpnId = selectedId?.mlsnSn;
  const queue = selectedRowQueue?.queueName;

  const [gridOpen, setGridOpen] = useState(false);
  const dispatch = useAppDispatch();
  const tableRef = useRef<ReactTabulator | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");
  const [selectedQueueName, setSelectedQueueName] = useState("");

  const columns: ColumnDefinition[] = [
    {
      title: "",
      width: 40,
      formatter: (cell: any) => {
        const checkbox = document.createElement("input");
        checkbox.type = "radio";
        checkbox.classList.add("form-check-input");

        checkbox.addEventListener("change", () => {
          const row = cell.getRow();
          const isChecked = checkbox.checked;

          if (isChecked) {
            const selectedRows = tableRef.current?.table.getSelectedRows();
            if (selectedRows) {
              selectedRows.forEach((selectedRow: any) => {
                const selectedCheckbox = selectedRow
                  .getElement()
                  .querySelector("input[type='radio']");
                if (selectedCheckbox && selectedCheckbox !== checkbox) {
                  (selectedCheckbox as HTMLInputElement).checked = false;
                  selectedRow.toggleSelect();
                }
              });
            }
          }

          row.toggleSelect();
        });

        return checkbox;
      },
      hozAlign: "center",
      headerSort: false,
    },
    { title: "Broker", field: "msnId", hozAlign: "left" },
    { title: "Vpn", field: "msgVpnName", hozAlign: "left" },
    { title: "Queue", field: "queueName", hozAlign: "left" },
  ];

  const fetchData = async () => {
    const baseUrl = `/api/v2/msgVpns/${msgVpnId}/queues/list`;
    try {
      const inSearchDiv = document.getElementById(
        "inSearchTerm"
      ) as HTMLInputElement;
      const inSearchVal = inSearchDiv.value;
      const params = {
        count: 100,
        where: inSearchVal,
      };

      const response = await axios.get(baseUrl, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
        params,
      });
      const DataVal = response.data.data;
      const resCode = response.status;

      if (resCode === 200) {
        setData(DataVal);
      }
    } catch (error) {
      console.error("에러:", error);
    }
  };

  const handleSearchClick = () => {
    fetchData();
  };

  const handleApply = () => {
    const selectedRows = tableRef.current?.table.getSelectedRows() || [];
    const selectedCount = selectedRows.length;
    const selectedItems = selectedRows.map((row: RowComponent) =>
      row.getData()
    );

    if (selectedItems && selectedCount > 0) {
      dispatch(setSelectedQueue({ queueName: selectedItems[0].queueName }));
      setGridOpen(false);
      setSelectedName("");
      setSearchTerm("");
    } else {
      alert("Choose a Queue");
    }
  };

  const handleCancel = () => {
    setSelectedName("");
    setSelectedQueueName("");
    setSearchTerm("");
    setGridOpen(false);
  };

  const handleMenuClick = () => {
    setGridOpen(!gridOpen);
  };

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleOutsideClick = (event: { target: any }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setGridOpen(false);
        setSelectedName("");
        setSelectedQueueName("");
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <a className="btn btn-outline-warning" onClick={handleMenuClick}>
        Change Queue
      </a>
      {gridOpen ? (
        <div
          ref={dropdownRef as React.RefObject<HTMLDivElement>}
          style={{
            position: "absolute",
            right: 0,
            padding: 0,
            top: 40,
            zIndex: 1000,
            backgroundColor: "#2f3032",
            border: "1px solid #9b9fa7",
          }}
        >
          <div className="p-2">
            <div className="sol_cont_search row no-gutters gap-2">
              <input
                type="text"
                className="form-control sol_input_search"
                placeholder="search..."
                id="inSearchTerm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchClick();
                  }
                }}
                style={{ width: "100%" }}
              />
            </div>
            <div className="mt-1">
              <ReactTabulator
                ref={tableRef}
                data={data}
                columns={columns}
                options={CHANGE_OPTION}
              />
              <div className="row mt-1">
                <p>
                  The maximum search result is 100. If you do not find the
                  search result you are looking for, please enter a more
                  detailed name.
                </p>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn hstack btn-outline-info"
                  onClick={handleApply}
                >
                  Apply
                </button>
                <button
                  className="btn hstack btn-outline-light"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ChangeQueue;

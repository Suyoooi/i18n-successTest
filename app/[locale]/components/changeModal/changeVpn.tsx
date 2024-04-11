"use client";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hook/hook";
import {
  setSelectedRow,
  setSelectedId,
  setSelectedMsnId,
} from "@/redux/slices/vpn/vpnSlice";
import axios from "axios";
import { setVpnInfo } from "@/redux/slices/vpn/monitorVpnSlice";
import { ColumnDefinition, ReactTabulator } from "react-tabulator";
import { CHANGE_OPTION } from "@/data/tabulator/options";
import { RowComponent } from "tabulator-tables";

const ChangeVpn: React.FC = () => {
  const selectedRow = useAppSelector((state) => state.isVpn.selectedRow);
  console.log("headerGrid msgVpnName:::", selectedRow?.msgVpnName);
  const [gridOpen, setGridOpen] = useState(false);
  const dispatch = useAppDispatch();
  const tableRef = useRef<ReactTabulator | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");
  const [selectedVpnId, setSelectedVpnId] = useState<string>("");
  const [selectedMsn, setSelectedMsn] = useState<string>("");

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
    { title: "Broker", field: "msnId", hozAlign: "left", width: 150 },
    { title: "Vpn", field: "msgVpnName", hozAlign: "left", width: 150 },
  ];

  const fetchData = async () => {
    const baseUrl = "/api/v2/mlsns";
    try {
      const inSearchDiv = document.getElementById(
        "inSearchTerm"
      ) as HTMLInputElement;
      const inSearchVal = inSearchDiv.value;

      const params = {
        count: 100,
        cursor: "",
        where: inSearchVal,
      };

      const response = await axios.get(baseUrl, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
        params,
      });
      const DataVal = response.data;
      console.log("데이터:", DataVal);
      setData(DataVal);
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
      dispatch(setSelectedRow({ msgVpnName: selectedItems[0].msgVpnName }));
      dispatch(setSelectedId({ mlsnSn: selectedItems[0].mlsnSn }));
      dispatch(setSelectedMsnId({ msnId: selectedItems[0].msnId }));
      dispatch(
        setVpnInfo({
          msgVpnName: selectedItems[0].msgVpnName,
          msnId: selectedItems[0].msnId,
        })
      );
      setGridOpen(false);
      setSearchTerm("");
      setSelectedName("");
    } else {
      alert("Choose a VPN");
    }
  };

  const handleCancel = () => {
    setSearchTerm("");
    setSelectedName("");
    setSelectedVpnId("");
    setGridOpen(false);
  };

  const handleMenuClick = () => {
    setGridOpen(!gridOpen);
    console.log(gridOpen);
  };

  // 백그라운드 클릭했을 때 모달 닫히도록 설정
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleOutsideClick = (event: { target: any }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setGridOpen(false);
        setSearchTerm("");
        setSelectedName("");
        setSelectedVpnId("");
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
        Change VPN
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
            {/* <!-- 검색 --> */}
            <div className="sol_cont_search row no-gutters gap-2">
              <input
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
              {/* <!-- tabulator --> */}
              <ReactTabulator
                ref={tableRef}
                data={data}
                columns={columns}
                options={CHANGE_OPTION}
              />
              {/* <!--// tabulator --> */}
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

export default ChangeVpn;

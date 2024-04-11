"use client";

import { useEffect, useRef, useState } from "react";
import { ColumnDefinition, ReactTabulator } from "react-tabulator";
import { RULE_OPTION } from "../../data/data";
import { useAddRuleContext } from "@/context/alert/addRuleContext";
import axios from "axios";

interface VpnProp {
  vpnBtn: boolean;
}

const Vpn: React.FC<VpnProp> = ({ vpnBtn }) => {
  const {
    vpnName,
    setVpnName,
    brokerName,
    setBrokerName,
    selectedMlsnData,
    setSelectedMlsnData,
  } = useAddRuleContext();

  const tableRef = useRef<ReactTabulator | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  // const [selectedMlsnData, setSelectedMlsnData] = useState<string>("");
  const [data, setData] = useState<any[]>([]);

  // 검색어 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    fetchRuleData();
  };

  useEffect(() => {
    if (!vpnBtn) {
      setData([]);
      setSearchTerm("");
    }
  }, [vpnBtn]);

  // rule 데이터
  const fetchRuleData = async () => {
    const baseUrl = "/api/v2/alertMgmt/alert-list";
    try {
      const params = {
        alertTargetType: "MLSN",
        ...(searchTerm && { search: searchTerm }),
      };
      const response = await axios.get(baseUrl, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
        params,
      });
      if (response.data.responseCode === 200) {
        setData(response.data.data);
      } else {
        alert("error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const checkboxFormatter = (cell: any) => {
    const name = cell.getRow().getData().name;
    const alertRule = cell.getRow().getData().rule;
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "selection";
    radio.checked = selectedMlsnData === name;
    radio.addEventListener("change", () => {
      setSelectedMlsnData(name);
      const [msn, mlsn] = name.split(">").map((part: any) => part.trim());
      setBrokerName(msn);
      setVpnName(mlsn);
    });
    return radio;
  };

  const vpnColumns: ColumnDefinition[] = [
    {
      title: "",
      field: "isSelected",
      headerSort: false,
      hozAlign: "center",
      width: 50,
      formatter: checkboxFormatter,
    },
    { title: "VPN Name", field: "name", hozAlign: "left", width: 300 },
    {
      title: "Alert Rule(s)",
      field: "ruleName",
      hozAlign: "left",
      formatter: (cell: any) => {
        const rowData = cell.getRow()._row.data;
        const ruleNm = rowData.ruleName;
        const ruleCount = rowData.ruleCnt;
        const color = "orange";

        let returnVal = "";
        if (ruleNm && ruleNm != "") {
          if (ruleCount && ruleCount > 0) {
            // returnVal = `${ruleNm} <span style="color: ${color};">+ ${ruleCount}</span>`;
            returnVal = `${ruleNm} <span class="sol_color_blue">+ ${ruleCount}</span>`;
          } else {
            returnVal = `${ruleNm}`;
          }
        }

        return returnVal;
      },
    },
  ];

  return (
    <>
      <div className={`row mt-2 ${vpnBtn ? "" : "d-none"}`}>
        <div className="align-items-center d-flex position-relative">
          <div className="col-md-5 align-items-center d-flex">
            <label
              className="col-sm-5 col-form-label float-start"
              style={{ width: 80 }}
            >
              VPN Name
            </label>
            <div className="col-sm-7  d-none">
              <input
                type="text"
                className="form-control sol_form_control sol_w230 justify-content-start"
                id="input_vpnname"
              />
            </div>
            <div className="col-sm-7">
              <input
                type="text"
                className="form-control sol_form_control sol_w230"
                id="input_vpnname"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          {/* <div className="col-md-5 align-items-center d-flex">
            <label className="col-sm-5 col-form-label sol_mr_10 float-start sol_w100 sol_pl_10">
              Queue Name
            </label>
            <div className="d-flex col-sm-7">
              <input
                type="text"
                className="col-sm-6 form-control float-start sol_w230 float-end sol_mr_10"
                id="input_queuename"
              />
            </div>
          </div> */}
          <div className="col-md-2 text-end position-absolute sol_rigbtn10">
            <button
              className="btn btn-outline-danger"
              onClick={handleSearchClick}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      {/* <div
        className={`row mt-2 ${vpnBtn ? "" : "d-none"}`}
        style={{ marginBottom: 8 }}
      >
        <div className="align-items-center col-md-9 d-flex">
          <label className="col-sm-2 col-form-label sol_mr_10 float-start">
            VPN Name
          </label>
          <div className="col-sm-7">
            <input
              type="text"
              className="form-control sol_form_control sol_w200"
              id="input_vpnname"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div> */}
      {/* <!--  tabulator --> */}
      {vpnBtn && (
        <ReactTabulator
          ref={tableRef}
          data={data}
          columns={vpnColumns}
          options={RULE_OPTION}
        />
      )}
    </>
  );
};

export default Vpn;

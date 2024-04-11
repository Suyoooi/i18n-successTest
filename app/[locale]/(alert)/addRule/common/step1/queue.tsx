"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useAddRuleContext } from "@/context/alert/addRuleContext";
import { ColumnDefinition, ReactTabulator } from "react-tabulator";
import { RULE_OPTION } from "../../data/data";
import { CellComponent } from "tabulator-tables";

interface QueueProp {
  queueBtn: boolean;
}

const Queue: React.FC<QueueProp> = ({ queueBtn }) => {
  const {
    vpnName,
    setVpnName,
    brokerName,
    setBrokerName,
    queueName,
    setQueueName,
    selectedVpn,
    setSelectedVpn,
  } = useAddRuleContext();

  const tableRef = useRef<ReactTabulator | null>(null);
  const [vpnData, setVpnData] = useState([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  // const [selectedVpn, setSelectedVpn] = useState<string>("");
  const [data, setData] = useState<any[]>([]);

  // queue일 때 vpnName
  const onVpnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedVpn(selectedValue);

    const [msn, mlsn] = selectedValue.split(">").map((item) => item.trim());
    setBrokerName(msn);
    setVpnName(mlsn);
    setQueueName("");
  };

  useEffect(() => {
    if (!queueBtn) {
      setData([]);
      setSearchTerm("");
    }
  }, [queueBtn]);

  const handleSearchClick = () => {
    if (selectedVpn === "") {
      alert("Choose VPN");
    } else {
      fetchRuleData();
    }
  };
  // 검색어 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 드롭다운 vpn 데이터
  const fetchVpnData = async () => {
    const baseUrl = "/api/v2/monitoring/nodes";
    try {
      const params = { serverType: "SOL" };
      const response = await axios.get(baseUrl, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
        params,
      });
      const transformedData = response.data.data.flatMap((item: any) =>
        item.mlsns.map((mlsn: any) => `${item.msn} > ${mlsn}`)
      );

      setVpnData(transformedData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchVpnData();
  }, []);

  // rule 데이터
  const fetchRuleData = async () => {
    const baseUrl = "/api/v2/alertMgmt/alert-list";
    console.log(baseUrl);
    try {
      const params = {
        alertTargetType: "QUE",
        msn: brokerName,
        mlsn: vpnName,
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
    radio.checked = queueName === name;
    radio.addEventListener("change", () => {
      setQueueName(name);
    });
    return radio;
  };

  const queueColumns: ColumnDefinition[] = [
    {
      title: "",
      field: "isSelected",
      headerSort: false,
      hozAlign: "center",
      width: 50,
      formatter: checkboxFormatter,
    },
    { title: "Queue Name", field: "name", hozAlign: "left", width: 300 },
    {
      title: "Alert Rule(s)",
      field: "ruleName",
      hozAlign: "left",
      formatter: (cell: any) => {
        const rowData = cell.getRow()._row.data;
        const ruleNm = rowData.ruleName;
        const ruleCount = rowData.ruleCnt;

        let returnVal = "";
        if (ruleNm && ruleNm != "") {
          if (ruleCount && ruleCount > 0) {
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
      <div className={`row mt-2 ${queueBtn ? "" : "d-none"}`}>
        <div className="align-items-center d-flex position-relative">
          <div className="col-md-5 align-items-center d-flex">
            <label
              className="col-sm-5 col-form-label float-start"
              style={{ width: 80 }}
            >
              VPN Name
            </label>
            <select
              className="col-sm-8 form-select sol_w230 float-start sol_form_control"
              id="input_vpnname"
              onChange={onVpnChange}
              value={selectedVpn}
            >
              <option hidden>choose vpn name</option>
              {vpnData.map((item, index) => (
                <option key={index}>{item}</option>
              ))}
            </select>
          </div>
          <div className="col-md-5 align-items-center d-flex">
            <label className="col-sm-5 col-form-label sol_mr_10 float-start sol_w100 sol_pl_10">
              Queue Name
            </label>
            <div className="d-flex col-sm-7">
              <input
                type="text"
                className="col-sm-6 form-control float-start sol_w230 float-end sol_mr_10"
                id="input_queuename"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
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
      {/* <!--  tabulator --> */}
      {queueBtn && (
        <ReactTabulator
          ref={tableRef}
          data={data}
          columns={queueColumns}
          options={RULE_OPTION}
        />
      )}
    </>
  );
};

export default Queue;

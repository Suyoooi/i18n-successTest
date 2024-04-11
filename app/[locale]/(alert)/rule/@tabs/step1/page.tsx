"use client";
import { useAddRuleContext } from "@/context/alert/addRuleContext";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ColumnDefinition, ReactTabulator } from "react-tabulator";
import { RULE_OPTION } from "../data/data";

const Step1 = () => {
  const {
    targetType,
    vpnBtn,
    setVpnBtn,
    selectedVpn,
    queueBtn,
    setQueueBtn,
    setTargetType,
    setVpnName,
    setBrokerName,
    vpnName,
    brokerName,
    setQueueName,
    setSelectedMlsnData,
    setSelectedVpn,
  } = useAddRuleContext();

  const router = useRouter();

  const handleVpnRadioBtnClick = () => {
    setVpnBtn(true);
    setQueueBtn(false);
    setVpnName("");
    setBrokerName("");
    setQueueName("");
    setSelectedVpn("");
  };

  const handleQueueRadioBtnClick = () => {
    setVpnBtn(false);
    setQueueBtn(true);
    setVpnName("");
    setBrokerName("");
    setQueueName("");
    setSelectedMlsnData("");
  };

  useEffect(() => {
    if (vpnBtn) {
      setTargetType("MLSN");
    } else if (queueBtn) {
      setTargetType("QUE");
    }
  }, [vpnBtn, queueBtn]);

  const handleNextClick = () => {
    const queueSelectedRows =
      queueTableRef.current?.table.getSelectedRows() || [];
    const selectedCount1 = queueSelectedRows.length;
    const selectedItems1 = queueSelectedRows.map((row: any) => row.getData());

    const vpnSelectedRows = vpnTableRef.current?.table.getSelectedRows() || [];
    const selectedCount2 = vpnSelectedRows.length;
    const selectedItems2 = vpnSelectedRows.map((row: any) => row.getData());

    if (vpnBtn) {
      if (selectedItems2.length > 0 && selectedCount2 > 0) {
        const [msn, mlsn] = selectedItems2[0].name
          .split(">")
          .map((part: any) => part.trim());
        if (!msn || !mlsn) {
          alert("Please select a valid VPN option.");
          return;
        } else {
          setBrokerName(msn);
          setVpnName(mlsn);
        }
      } else {
        alert("No VPN option selected.");
        return;
      }
      setSearchTerm("");
      router.push("/rule/step2");
    } else if (queueBtn) {
      if (selectedItems1.length > 0 && selectedCount1 > 0) {
        if (!selectedItems1[0].name) {
          alert("Please select a valid Queue option.");
          return;
        } else {
          setQueueName(selectedItems1[0].name);
        }
      } else {
        alert("No Queue option selected.");
        return;
      }
      setSearchTerm("");
      router.push("/rule/step2");
    } else {
      alert("Choose Options");
    }
  };

  useEffect(() => {
    if (!vpnBtn) {
      setData([]);
      setSearchTerm("");
    }
  }, [vpnBtn]);

  const vpnTableRef = useRef<ReactTabulator | null>(null);
  const queueTableRef = useRef<ReactTabulator | null>(null);
  const [vpnData, setVpnData] = useState([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
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
    if (queueBtn && selectedVpn === "") {
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
        alertTargetType: targetType,
        ...(brokerName && { msn: brokerName }),
        ...(vpnName && { mlsn: vpnName }),
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

  const queueColumns: ColumnDefinition[] = [
    {
      title: "",
      field: "isSelected",
      headerSort: false,
      hozAlign: "center",
      width: 50,
      formatter: (cell: any) => {
        const checkbox = document.createElement("input");
        checkbox.type = "radio";
        checkbox.classList.add("form-check-input");

        checkbox.addEventListener("change", () => {
          const row = cell.getRow();
          const isChecked = checkbox.checked;

          if (isChecked) {
            const selectedRows = queueTableRef.current?.table.getSelectedRows();
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

  const vpnColumns: ColumnDefinition[] = [
    {
      title: "",
      field: "isSelected",
      headerSort: false,
      hozAlign: "center",
      width: 50,
      formatter: (cell: any) => {
        const checkbox = document.createElement("input");
        checkbox.type = "radio";
        checkbox.classList.add("form-check-input");

        checkbox.addEventListener("change", () => {
          const row = cell.getRow();
          const isChecked = checkbox.checked;

          if (isChecked) {
            const selectedRows = vpnTableRef.current?.table.getSelectedRows();
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
    <div className="tab-base">
      <div className="tab-content">
        <div className="mt-5 row justify-content-center">
          <div className="sol_w800">
            <div className="sol_box_p0 sol_p_20">
              <div className="row col-md-12">
                {/* <!-- check --> */}
                <div className="d-flex col-md-3 float-start align-items-center">
                  <div className="col-sm-5 form-check form-check-inline sol_mr_20">
                    <input
                      type="radio"
                      id="radio_vpn"
                      className="form-check-input sol_mr_6"
                      checked={vpnBtn}
                      onChange={handleVpnRadioBtnClick}
                      style={styles.btn}
                    />
                    <label className="form-check-label" htmlFor="radio_vpn">
                      VPN
                    </label>
                  </div>
                  <div className="col-sm-5 form-check form-check-inline">
                    <input
                      type="radio"
                      id="radio_queuevpn"
                      className="form-check-input sol_mr_6"
                      checked={queueBtn}
                      onChange={handleQueueRadioBtnClick}
                      style={styles.btn}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="radio_queuevpn"
                    >
                      Queue
                    </label>
                  </div>
                </div>
              </div>
              {/* <!-- 검색 (VPN 체크 시) --> */}
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
              {vpnBtn && (
                <ReactTabulator
                  ref={vpnTableRef}
                  data={data}
                  columns={vpnColumns}
                  options={RULE_OPTION}
                />
              )}
              {/* <!-- 검색 (Queue 체크 시) --> */}
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
                  ref={queueTableRef}
                  data={data}
                  columns={queueColumns}
                  options={RULE_OPTION}
                />
              )}
              {/* <!--  tabulator --> */}
            </div>
            <div className="d-flex sol_mtb_15">
              <div className="col-md-6">
                <button className="btn btn-md btn-outline-light disabled">
                  <i className="sol_i_prev sol_mr_6" />
                  Prev
                </button>
              </div>
              <div className="col-md-6 text-end">
                <button
                  className="btn btn-md btn-outline-light justify-content-end"
                  onClick={handleNextClick}
                >
                  Next
                  <i className="sol_i_next sol_ml_6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;

const styles = {
  btn: {
    cursor: "pointer",
  },
};

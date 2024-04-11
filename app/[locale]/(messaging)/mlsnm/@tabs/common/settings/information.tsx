"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hook/hook";
import axios from "axios";
import * as yup from "yup";
import { INFORMATION_DATA, INFORMATION_DATA2 } from "@/data/gridData";

interface InformationProps {
  data: any;
  isEditStatus: boolean;
  onEditChange?: (isEditing: boolean) => void;
  onTitleClick: (tipNum: number) => void;
  onUpdateData: (newData: any) => void;
}

interface DataState {
  maxMsgSpoolUsage: number | null;
}

const Information: React.FC<InformationProps> = ({
  data,
  isEditStatus,
  onEditChange,
  onTitleClick,
  onUpdateData,
}) => {
  const router = useRouter();
  const selectedRow = useAppSelector((state) => state.isVpn.selectedRow);
  const selectedMsnId = useAppSelector((state) => state.isVpn.selectedMsnId);
  const [msgData, setMsgData] = useState<any>({});
  const [isEdit, setIsEdit] = useState<boolean>(isEditStatus);
  const [isEnable, setIsEnable] = useState<boolean>(data?.enabled || false);
  const [spoolUsage, setSpoolUsage] = useState<number>(
    data.maxMsgSpoolUsage || null
  );
  const [spoolUsageError, setSpoolUsageError] = useState<string | null>(null);

  const msgVpnName = selectedRow?.msgVpnName;
  console.log(data);
  useEffect(() => {
    if (Object.keys(data).length === 0) {
      onUpdateData(INFORMATION_DATA2);
    }
  }, [data, onUpdateData]);

  const validationSchema = yup.object({
    maxMsgSpoolUsage: yup
      .number()
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? null : value
      )
      .typeError("Messages Queued Quota (MB) must be an integer.")
      .min(
        0,
        "Messages Queued Quota (MB) must be an integer between 0 and 6000000."
      )
      .max(
        6000000,
        "Messages Queued Quota (MB) must be an integer between 0 and 6000000."
      )
      .required(
        "Messages Queued Quota (MB) is required and must be an integer between 0 and 6000000."
      ),
  });

  const handleDoubleClick = () => {
    router.push("/edit/mlsnm/settings");
  };

  const handleTitleClick = (id: number) => {
    onTitleClick(id);
  };

  const handleToggleChange = () => {
    const newEnabledState = !isEnable;
    setIsEnable(!isEnable);
    const updatedData = {
      ...data,
      enabled: newEnabledState,
    };
    onUpdateData(updatedData);
  };

  const fetchData = async () => {
    const url = `/api/v2/msgVpns/ha-config-status`;
    const msn = selectedMsnId?.msnId;

    try {
      const params = {
        msn: msn,
      };
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
        params,
      });

      const DataVal = response.data;
      console.log("::information:::데이터", DataVal);
      const activeFailovers = DataVal.filter(
        (obj: any) => obj.failoverStatus === "active"
      );
      if (activeFailovers.length > 0) {
        setMsgData(activeFailovers[0]);
      } else {
        setMsgData(INFORMATION_DATA[0]);
      }
      console.log(msgData);
    } catch (error) {
      console.error("에러:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMsnId]);

  // const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value, name } = event.target;
  //   const numericValue = parseFloat(value);
  //   setSpoolUsage(numericValue);
  //   const updatedData = {
  //     ...data,
  //     [name]: isNaN(numericValue) ? null : numericValue,
  //     dmrEnabled: isEnable,
  //   };
  //   onUpdateData(updatedData);
  // };

  const handleDataChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, name } = event.target;
    let numericValue = parseFloat(value);
    numericValue = isNaN(numericValue) ? 0 : numericValue;

    try {
      await validationSchema.validateAt("maxMsgSpoolUsage", {
        maxMsgSpoolUsage: numericValue,
      });
      setSpoolUsage(numericValue);
      const updatedData = {
        ...data,
        [name]: numericValue,
        dmrEnabled: isEnable,
      };
      onUpdateData(updatedData);
      setSpoolUsageError(null);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        console.error(error.message);
        setSpoolUsageError(error.message);
      }
    }
  };

  useEffect(() => {
    setIsEdit(isEditStatus);
    setIsEnable(data.enabled || false);
    setSpoolUsage(data.maxMsgSpoolUsage || null);
  }, [data, isEditStatus]);

  return (
    <div className="sol_ml_10">
      <div className="row col-md-8 align-items-center">
        <label
          id="1"
          className={`col-sm-5 col-form-label ${
            isEdit ? "" : "sol_highlightLabel"
          }`}
          onClick={() => handleTitleClick(35)}
        >
          Message Broker Name
        </label>
        <div className="col-sm-7 col-form-label">
          <input
            readOnly={true}
            onDoubleClick={handleDoubleClick}
            onChange={handleDataChange}
            value={msgData.msnId}
            id="set_messagebrokername"
            type="text"
            className="form-control sol_w300"
            style={{
              backgroundColor: "#414447",
              borderColor: "#808182",
              borderWidth: "1px",
              borderStyle: "solid",
              color: "#838383",
            }}
          />
        </div>
      </div>
      <div className="row col-md-8 align-items-center">
        <label
          className={`col-sm-5 col-form-label ${
            isEdit ? "" : "sol_highlightLabel"
          }`}
          onClick={() => handleTitleClick(36)}
        >
          Message Broker IP Address
        </label>
        <div className="col-sm-7 col-form-label">
          <input
            readOnly={true}
            onDoubleClick={handleDoubleClick}
            onChange={handleDataChange}
            value={msgData.url}
            id="set_messagebrokername"
            type="text"
            className="form-control sol_w300"
            style={{
              backgroundColor: "#414447",
              borderColor: "#808182",
              borderWidth: "1px",
              borderStyle: "solid",
              color: "#838383",
            }}
          />
        </div>
      </div>
      <div className="row col-md-8 align-items-center">
        <label
          className={`col-sm-5 col-form-label ${
            isEdit ? "" : "sol_highlightLabel"
          }`}
          onClick={() => handleTitleClick(37)}
        >
          Message Broker Port No
        </label>
        <div className="col-sm-7 col-form-label">
          <input
            readOnly={true}
            onDoubleClick={handleDoubleClick}
            onChange={handleDataChange}
            value={msgData.port}
            id="set_messagebrokername"
            type="text"
            className="form-control sol_w300"
            style={{
              backgroundColor: "#414447",
              borderColor: "#808182",
              borderWidth: "1px",
              borderStyle: "solid",
              color: "#838383",
            }}
          />
        </div>
      </div>
      <div className="row col-md-8 align-items-center">
        <label
          className={`col-sm-5 col-form-label ${
            isEdit ? "" : "sol_highlightLabel"
          }`}
          onClick={() => handleTitleClick(38)}
        >
          Message VPN Name
        </label>
        <div className="col-sm-7 col-form-label">
          <input
            // readOnly={isEdit}
            readOnly={true}
            onDoubleClick={handleDoubleClick}
            onChange={handleDataChange}
            value={msgVpnName}
            id="set_messagebrokername"
            type="text"
            className="form-control sol_w300"
            style={{
              // backgroundColor: !isEdit ? "" : "#414447",
              // borderColor: !isEdit ? "" : "#808182",
              // borderWidth: !isEdit ? "" : "1px",
              // borderStyle: !isEdit ? "" : "solid",
              // color: !isEdit ? "" : "#838383",
              backgroundColor: "#414447",
              borderColor: "#808182",
              borderWidth: "1px",
              borderStyle: "solid",
              color: "#838383",
            }}
          />
        </div>
      </div>
      {/* Enable Toggle Switch */}
      <div className="row col-md-8 align-items-center">
        <label
          className={`col-sm-5 col-form-label ${
            isEdit ? "" : "sol_highlightLabel"
          }`}
          onClick={() => handleTitleClick(1)}
        >
          Enabled
        </label>
        <div className="col-sm-7 col-form-label">
          <div className="form-check form-switch">
            <input
              id="set_enabled"
              className="form-check-input"
              type="checkbox"
              checked={isEnable}
              disabled={isEdit}
              onChange={handleToggleChange}
            />
          </div>
        </div>
      </div>
      <div className="row col-md-8 align-items-center">
        <label
          className={`col-sm-5 col-form-label ${
            isEdit ? "" : "sol_highlightLabel"
          }`}
          htmlFor="set_maximummessage"
          onClick={() => handleTitleClick(2)}
        >
          Maximum Message spool Usage (MB)
        </label>
        <div className="col-sm-7 col-form-label">
          <input
            readOnly={isEdit}
            onDoubleClick={handleDoubleClick}
            onChange={handleDataChange}
            name="maxMsgSpoolUsage"
            type="text"
            className={`form-control sol_w300 ${!isEdit ? "disabled" : ""}`}
            style={{
              backgroundColor: !isEdit ? "" : "#414447",
              borderColor: !isEdit ? "" : "#808182",
              borderWidth: !isEdit ? "" : "1px",
              borderStyle: !isEdit ? "" : "solid",
              color: !isEdit ? "" : "#838383",
            }}
            value={spoolUsage}
          />
          {spoolUsageError && (
            <div style={{ color: "red" }}>{spoolUsageError}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Information;

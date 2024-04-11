import { CODE } from "@/api/urlPath";
import { useAppSelector } from "@/hook/hook";
import axios from "axios";
import qs from "qs";
import React, { useEffect, useState } from "react";

axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { arrayFormat: "repeat" });
};

interface ClientProps {
  vpnIdVal: any;
  selectedValue?: string;
  placeholder?: boolean;
}

const ClientList: React.FC<ClientProps> = ({
  vpnIdVal,
  selectedValue,
  placeholder,
}) => {
  const [clientData, setClientData] = useState<any[]>([]);

  const headerInfo = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  };

  const fetchClientList = async () => {
    const codeUrl = `/api/v2/msgVpns/${vpnIdVal}/clientUsernames`;

    try {
      const response = await axios.get(codeUrl, {
        headers: headerInfo,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      });

      console.log(response.data);
      setClientData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchClientList();
  }, []);

  return (
    <>
      {placeholder === false ? (
        <></>
      ) : (
        <option value="" key="all" hidden>
          Select Owner
        </option>
      )}
      {clientData.map((cliData) => (
        <option
          value={cliData.clientUsername}
          key={cliData.clientUsername}
          selected={cliData.clientUsername === selectedValue}
        >
          {cliData.clientUsername}
        </option>
      ))}
    </>
  );
};

export default ClientList;

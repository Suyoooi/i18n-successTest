"use client";

import { CODE } from "@/api/urlPath";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface CodeProps {
  codeGroupId: string;
  selectedValue?: string;
  placeholder?: boolean;
  onItemSelect?: (cdId: string, cdNm: string, addInfo1: string) => void;
  addStyle?: string;
}

const CodeNameList: React.FC<CodeProps> = ({
  codeGroupId,
  selectedValue,
  placeholder,
  onItemSelect,
  addStyle,
}) => {
  const [codeLst, setCodeLst] = useState<any[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCdId = event.target.value;
    const selectedItem = codeLst.find((code) => code.cdId === selectedCdId);
    if (selectedItem && onItemSelect) {
      onItemSelect(selectedCdId, selectedItem.cdNm, selectedItem.addInfo1);
    }
  };

  const fetchCodeList = async () => {
    const codeUrl = `/api/v2/${CODE}`;

    try {
      const params = {
        type: codeGroupId,
      };
      const response = await axios.get(codeUrl, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
        params,
      });
      setCodeLst(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchCodeList();
  }, [codeGroupId]);

  return (
    <select
      className={`form-select ${addStyle || ""}`}
      onChange={handleChange}
      value={selectedValue || ""}
    >
      {placeholder !== false && (
        <option value="" hidden>
          Select option
        </option>
      )}
      {codeLst.map((code) => (
        <option value={code.cdId} key={code.cdId}>
          {code.cdNm}
        </option>
      ))}
    </select>
  );
};

export default CodeNameList;

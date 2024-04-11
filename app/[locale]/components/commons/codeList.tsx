import { CODE } from "@/api/urlPath";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface CodeProps {
  codeGroupId: string;
  selectedValue?: string;
  // default 값이 있을 경우엔 placeholder === false
  placeholder?: boolean;
}

const CodeList: React.FC<CodeProps> = ({
  codeGroupId,
  selectedValue,
  placeholder,
}) => {
  const [codeLst, setCodeLst] = useState<any[]>([]);

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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchCodeList();
  }, []);

  return (
    <>
      {placeholder === false ? (
        <></>
      ) : (
        <option value="" key="all" hidden>
          Select option
        </option>
      )}
      {/* {codeLst &&
        codeLst.map((code) => (
          <option value={code.cdId} key={code.cdId}>
            {code.cdNm}
          </option>
        ))} */}
      {codeLst.map((code) => (
        <option
          value={code.cdId}
          key={code.cdId}
          selected={code.cdId === selectedValue}
        >
          {code.cdNm}
        </option>
      ))}
    </>
  );
};

export default CodeList;

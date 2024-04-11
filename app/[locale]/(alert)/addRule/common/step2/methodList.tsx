import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAddRuleContext } from '@/context/alert/addRuleContext';
import { CODE } from '@/api/urlPath';

interface CodeProps {
  codeGroupId: string;
  selectedValue?: string;
  placeholder?: boolean;
  onItemSelect?: (cdId: string, cdNm: string) => void;
  addStyle?: string;
}

const MethodList: React.FC<CodeProps> = ({
  codeGroupId,
  selectedValue,
  placeholder,
  onItemSelect,
  addStyle
}) => {
  const { selectedCdInfo, targetItem } = useAddRuleContext();
  const [codeLst, setCodeLst] = useState<any[]>([]);
  const [filteredCodeLst, setFilteredCodeLst] = useState<any[]>([]);

  useEffect(() => {
    const fetchCodeList = async () => {
      const codeUrl = `/api/v2/${CODE}`;
      try {
        const params = { type: codeGroupId };
        const response = await axios.get(codeUrl, {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          },
          params
        });
        setCodeLst(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCodeList();
  }, [codeGroupId]);

  useEffect(() => {
    const isThresholds =
      selectedCdInfo.includes('CPR') || selectedCdInfo.includes('CPT');
    const isNelson = selectedCdInfo.includes('RULE');

    let newFilteredCodeLst = codeLst;

    if (isThresholds && !isNelson) {
      newFilteredCodeLst = codeLst.filter(code => code.cdId === 'THRESHOLD');
    } else if (!isThresholds && isNelson) {
      newFilteredCodeLst = codeLst.filter(code => code.cdId === 'NELSON_RULE');
    } else if (!isThresholds && !isNelson) {
      newFilteredCodeLst = [];
    }

    setFilteredCodeLst(newFilteredCodeLst);

    // Auto select
    if (targetItem !== null) {
      if (
        newFilteredCodeLst.length === 1 &&
        newFilteredCodeLst[0].cdId === 'NELSON_RULE' &&
        onItemSelect
      ) {
        onItemSelect(newFilteredCodeLst[0].cdId, newFilteredCodeLst[0].cdNm);
      } else if (
        newFilteredCodeLst.length === 1 &&
        newFilteredCodeLst[0].cdId === 'THRESHOLD' &&
        onItemSelect
      ) {
        onItemSelect(newFilteredCodeLst[0].cdId, newFilteredCodeLst[0].cdNm);
      }
    }
  }, [codeLst, selectedCdInfo, onItemSelect]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCdId = event.target.value;
    const selectedItem = filteredCodeLst.find(
      code => code.cdId === selectedCdId
    );
    if (selectedItem && onItemSelect) {
      onItemSelect(selectedCdId, selectedItem.cdNm);
    }
  };

  return (
    <select
      className={`form-select ${addStyle || ''}`}
      onChange={handleChange}
      value={selectedValue || ''}>
      {placeholder !== false && (
        <option value="" hidden>
          Select option
        </option>
      )}
      {filteredCodeLst.map(code => (
        <option value={code.cdId} key={code.cdId}>
          {code.cdNm}
        </option>
      ))}
    </select>
  );
};

export default MethodList;

'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface PageSizeSelectorProps {
  pageSize: number;
  onPageSizeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: number; label: string }>;
}
const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  pageSize,
  onPageSizeChange,
  options
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="sol_a sol_mr_6 sol_ml_6">{t('19')}</div>
      <select
        id="pagesize"
        className="form-select sol_w100"
        onChange={onPageSizeChange}
        value={pageSize}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default PageSizeSelector;

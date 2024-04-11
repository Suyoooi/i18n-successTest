'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface RefreshProps {
  onRefreshClick: () => void;
  refreshTime: string;
}

const RefreshData: React.FC<RefreshProps> = ({
  onRefreshClick,
  refreshTime
}) => {
  const { t } = useTranslation();
  console.log('footer :::::', t('MUL_WD_0012'));

  return (
    <>
      <div className="col-form-label sol_mr_6">
        {t('18')} {refreshTime}
      </div>
      <button
        className="btn hstack btn-outline-secondary sol_mr_6"
        onClick={onRefreshClick}>
        {t('17')}
      </button>
    </>
  );
};

export default RefreshData;

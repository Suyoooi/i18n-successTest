'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface PaginationButtonsProps {
  currentPage: number;
  onFirstClick: () => void;
  onPrevClick: () => void;
  onNextClick: () => void;
  onLastClick: () => void;
  onNumberClick: (pageNumber: number) => void; // 페이지 번호 클릭 핸들러
  totalPages: number; // 총 페이지 수
  btnCnt: number;
  isFirstActive: boolean;
  isNextActive: boolean;
}

const PaginationBtn: React.FC<PaginationButtonsProps> = ({
  currentPage,
  onFirstClick,
  onPrevClick,
  onNextClick,
  onLastClick,
  onNumberClick,
  totalPages,
  btnCnt,
  isFirstActive,
  isNextActive
}) => {
  const { t } = useTranslation();

  // 페이지 번호 버튼을 생성하는 함수
  const renderPageNumbers = () => {
    let pageNumbers = [];
    // 현재 페이지의 이전 페이지부터 시작
    let startPage = Math.max(currentPage - 1, 1);
    // 시작 페이지로부터 최대 2개의 페이지를 더 표시
    let endPage = Math.min(startPage + btnCnt, totalPages);

    // 시작 페이지 번호 조정 (총 페이지 수가 3개 이하이거나, 마지막 페이지가 포함되도록)
    if (endPage === totalPages) {
      // 마지막 페이지를 포함하는 경우
      // 시작 페이지를 조정하여 항상 3개의 페이지 번호를 유지
      startPage = Math.max(endPage - btnCnt, 1);
    }

    if (totalPages && totalPages != 0) {
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <button
            key={i}
            type="button"
            className={`btn btn-outline-light sol_mr_6 ${
              i === currentPage ? 'active' : ''
            }`}
            onClick={() => onNumberClick(i)}>
            {i}
          </button>
        );
      }
    } else {
      pageNumbers.push(
        <button
          key={1}
          type="button"
          className={`btn btn-outline-light sol_mr_6 disabled`}>
          {1}
        </button>
      );
    }
    return pageNumbers;
  };
  return (
    <div className="col gap-2">
      <button
        type="button"
        className={`btn btn-outline-light sol_mr_6 ${
          isFirstActive ? '' : 'disabled'
        }`}
        onClick={onPrevClick}>
        <i className="sol_i_prev sol_mr_6" />
        {t('15')}
      </button>
      {renderPageNumbers()}
      <button
        type="button"
        className={`btn btn-outline-light sol_mr_6 ${
          isNextActive ? '' : 'disabled'
        }`}
        onClick={onNextClick}>
        {t('16')}
        <i className="sol_i_next sol_ml_6" />
      </button>
    </div>
  );
};

export default PaginationBtn;

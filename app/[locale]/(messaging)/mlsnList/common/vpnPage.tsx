'use client';

import React, { useEffect, useRef, useState } from 'react';
import VpnBox from './vpnCard';
import { ActionData, vpnColumn } from '@/data/gridData';
import PageSizeSelector from '@/app/[locale]/components/footer/pageSizeSelector';
import PaginationBtn from '@/app/[locale]/components/footer/paginationBtn';
import RefreshData from '@/app/[locale]/components/footer/refreshData';
import axios from 'axios';
import useRefreshData from '@/hook/useRefreshData';
import { formatDateTime } from '@/utils/dateTimeFormat';
import {
  setSelectedRow,
  setSelectedId,
  setSelectedMsnId
} from '@/redux/slices/vpn/vpnSlice';
import { ReactTabulator, ReactTabulatorOptions } from 'react-tabulator';
import { useAppDispatch } from '@/hook/hook';
import { useRouter, useSearchParams } from 'next/navigation';
import { setVpnInfo } from '@/redux/slices/vpn/monitorVpnSlice';
import { pageOptions } from '@/types/grid';
import { useTranslation } from 'react-i18next';

const VpnPage = () => {
  const { t } = useTranslation();

  const tableRef = useRef<ReactTabulator | null>(null);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [girdStatus, setGridStatus] = useState<boolean>(false);
  const [boxStatus, setBoxStatus] = useState<boolean>(true);
  const { refreshTime, refreshData } = useRefreshData(
    formatDateTime(new Date())
  );

  const totalPages = Math.ceil(totalDataCount / pageSize);

  const handleFirstClick = () => {
    setCurrentPage(1);
  };
  const handlePrevClick = () => {
    setCurrentPage(currentPage => Math.max(currentPage - 1, 1));
  };
  const handleNextClick = () => {
    setCurrentPage(currentPage =>
      Math.min(currentPage + 1, Math.ceil(data.length / pageSize))
    );
  };
  const handleLastClick = () => {
    setCurrentPage(totalPages);
  };
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const fetchData = async () => {
    const baseUrl = '/api/v2/mlsns';
    try {
      const params = {
        where: searchTerm
      };
      const response = await axios.get(baseUrl, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        },
        params
      });
      const DataVal = response.data;
      // const DataVal = response.data;
      setData(DataVal);
      console.log(DataVal);
      const totalData = DataVal.length;
      setTotalDataCount(totalData);
    } catch (error) {
      console.error('에러:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTime]);

  useEffect(() => {
    // 검색어 필터링
    const filteredData = data?.filter(item =>
      item.msgVpnName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalFilteredData = filteredData?.length;
    setTotalDataCount(totalFilteredData);
    // 시작 인덱스
    const begin = (currentPage - 1) * pageSize;
    // 끝 인덱스
    const end = begin + pageSize;
    const currentData = filteredData?.slice(begin, end);
    // 보여줄 데이터 === 현재 데이터
    setDisplayData(currentData);
  }, [currentPage, pageSize, data, searchTerm]);

  const handleGridClick = () => {
    setGridStatus(true);
    setBoxStatus(false);
  };

  const handleBoxClick = () => {
    setBoxStatus(true);
    setGridStatus(false);
  };

  // 검색어 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // 페이지 변경 핸들러
  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSize = Number(event.target.value);
    setPageSize(newSize);

    const newTotalPages = Math.ceil(totalDataCount / newSize);
    setCurrentPage(current => Math.min(current, newTotalPages));
  };

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const tableKey = JSON.stringify({ pageSize });
  const [selectedVpn, setSelectedVpn] = useState<string>('');
  const [rightClick, setRightClick] = useState<boolean>(false);
  const [rightClickPosition, setRightClickPosition] = useState({ x: 0, y: 0 });

  // columns를 체크박스와 데이터로 분리해서 합침!
  const checkboxColumn = {
    title: '',
    width: 40,
    formatter: function (cell: any, formatterParams: any, onRendered: any) {
      var checkbox: any = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('form-check-input');

      if (tableRef.current && tableRef.current.table) {
        const table = tableRef.current.table;

        if (table.modExists('selectRow', true)) {
          checkbox.addEventListener('click', (e: any) => {
            e.stopPropagation();
          });

          if (typeof cell.getRow == 'function') {
            var row = cell.getRow();

            if (row._getSelf().type == 'row') {
              checkbox.addEventListener('change', (e: any) => {
                row.toggleSelect();
              });

              checkbox.checked = row.isSelected && row.isSelected();
              table.modules.selectRow.registerRowSelectCheckbox(row, checkbox);
            } else {
              checkbox = '';
            }
          } else {
            checkbox.addEventListener('change', (e: any) => {
              if (table.modules.selectRow.selectedRows.length) {
                table.deselectRow();
              } else {
                table.selectRow(formatterParams.rowRange);
              }
            });

            table.modules.selectRow.registerHeaderSelectCheckbox(checkbox);
          }
        }
      }
      return checkbox;
    },
    titleFormatter: function (
      cell: any,
      formatterParams: any,
      onRendered: any
    ) {
      var checkbox: any = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('form-check-input');

      if (tableRef.current && tableRef.current.table) {
        const table = tableRef.current.table;

        if (table.modExists('selectRow', true)) {
          checkbox.addEventListener('click', (e: any) => {
            e.stopPropagation();
          });

          if (typeof cell.getRow == 'function') {
            var row = cell.getRow();

            if (row._getSelf().type == 'row') {
              checkbox.addEventListener('change', (e: any) => {
                row.toggleSelect();
              });

              checkbox.checked = row.isSelected && row.isSelected();
              table.modules.selectRow.registerRowSelectCheckbox(row, checkbox);
            } else {
              checkbox = '';
            }
          } else {
            checkbox.addEventListener('change', (e: any) => {
              if (table.modules.selectRow.selectedRows.length) {
                table.deselectRow();
              } else {
                table.selectRow(formatterParams.rowRange);
              }
            });

            table.modules.selectRow.registerHeaderSelectCheckbox(checkbox);
          }
        }
      }
      return checkbox;
    },
    hozAlign: 'center',
    frozen: true,
    headerSort: false,
    cssClass: 'text-center'
  };

  // 기존 columns에 체크박스 column을 추가함@
  const allColumns = [checkboxColumn, ...vpnColumn];

  useEffect(() => {}, [selectedVpn]);

  useEffect(() => {}, [selectedRows]);

  useEffect(() => {}, [rightClickPosition]);

  const handleActionClick = () => {
    if (tableRef.current) {
      const selectedDataValue = tableRef.current.table;
      if (selectedDataValue) {
        console.log(selectedDataValue);
        setSelectedRows(selectedDataValue.getSelectedData());
      }
    }
  };

  const handleDeleteClick = () => {
    alert(`VPN ${selectedVpn}를 삭제하시겠습니까?`);
    setRightClick(false);
  };

  const handleActionTitleClick = (item: any) => {
    if (tableRef.current) {
      const selectedDataValue = tableRef.current.table.getSelectedData();
      if (selectedDataValue.length === 1) {
        setSelectedVpn(selectedDataValue[0].msgVpnName);
        dispatch(
          setSelectedRow({ msgVpnName: selectedDataValue[0].msgVpnName })
        );
        dispatch(setSelectedId({ mlsnSn: selectedDataValue[0].mlsnSn }));
        dispatch(setSelectedMsnId({ msnId: selectedDataValue[0].msnId }));

        if (item.url) {
          if (item.id === 4) {
            const monitorUrl = `${item.url}?msn=${selectedDataValue[0].msnId}&mlsn=${selectedDataValue[0].msgVpnName}`;
            router.push(monitorUrl);
          } else {
            router.push(item.url);
          }
        } else {
          // handleDeleteClick();
        }
      }
    }
  };

  // react-tabulator footer 없애는 로직
  const renderStarted = async (e: any) => {
    const el = document.getElementsByClassName(
      'tabulator-footer'
    )[0] as HTMLElement;
    el.style.display = 'none';
  };

  // 백그라운드 클릭했을 때 모달 닫히도록 설정
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleOutsideClick = (event: { target: any }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setRightClick(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // row 클릭
  const rowClick = (e: any, row: any) => {
    const rowClickData = row.getData().msgVpnName;
    const rowClickDataId = row.getData().mlsnSn;
    const rowClickDataNsnId = row.getData().msnId;
    dispatch(setSelectedRow({ msgVpnName: rowClickData }));
    dispatch(setSelectedId({ mlsnSn: rowClickDataId }));
    dispatch(setSelectedMsnId({ msnId: rowClickDataNsnId }));
    dispatch(
      setVpnInfo({ msgVpnName: rowClickData, msnId: rowClickDataNsnId })
    );

    router.push('/mlsnm');
  };

  // row 우클릭
  const rowContext = (e: any, row: any) => {
    e.preventDefault();
    const tableInfo = tableRef.current?.table;

    if (tableInfo) {
      tableInfo.deselectRow();
      row.select();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // 메뉴 크기
      const menuWidth = 230;
      const menuHeight = 200;

      // 화면 크기
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // 메뉴가 화면을 벗어나지 않도록 조정
      const x =
        mouseX + menuWidth > screenWidth ? screenWidth - menuWidth : mouseX;
      const y =
        mouseY + menuHeight > screenHeight
          ? screenHeight - menuHeight - 40
          : mouseY;

      setRightClickPosition({ x, y });
      setRightClick(true);
    }
  };

  return (
    <>
      <div className="content__wrap sol_content_pb50">
        <div className="sol_breadcrumb_area">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">MLSN</li>
              <li className="breadcrumb-item active" aria-current="page">
                {t('01')}
              </li>
            </ol>
          </nav>
        </div>
        <div className="row mt-3">
          <div className="col-md-8">
            <div className="sol_cont_search row no-gutters gap-2">
              <input
                type="text"
                className="form-control sol_input_search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button
                className="btn hstack btn-icon sol_button_outline sol_sort"
                onClick={handleBoxClick}>
                <i className="sol_i_card"></i>
              </button>
              <button
                className="btn hstack btn-icon sol_button_outline sol_sort"
                onClick={handleGridClick}>
                <i className="sol_i_list"></i>
              </button>
            </div>
          </div>

          <div className="col-md-4 d-flex justify-content-end gap-2">
            {girdStatus && (
              <div className="btn-group">
                <a
                  className="btn hstack btn-outline-light"
                  data-bs-toggle="dropdown"
                  onClick={handleActionClick}>
                  Action
                </a>
                <ul className="dropdown-menu">
                  {ActionData.map(actionItem => {
                    const isDisabled =
                      (selectedRows.length !== 1 &&
                        [1, 2, 3, 4, 5].includes(actionItem.id)) ||
                      (selectedRows.length === 0 &&
                        [6].includes(actionItem.id)) ||
                      actionItem.id === 6 ||
                      actionItem.id === 3;
                    return (
                      <li key={actionItem.id}>
                        <a
                          onClick={event => {
                            if (isDisabled) {
                              event.preventDefault();
                              return;
                            }
                            event.stopPropagation();
                            handleActionTitleClick(actionItem);
                          }}
                          className={`dropdown-item ${
                            isDisabled ? 'disabled' : ''
                          }`}
                          style={{
                            cursor: isDisabled ? 'default' : 'pointer',
                            opacity: isDisabled ? 0.3 : 1,
                            color: actionItem.id === 6 ? '#FE7366' : '#e1e7f0'
                          }}>
                          {actionItem.title}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            <a className="btn hstack btn-outline-info">+ VPN</a>
          </div>
        </div>
        {boxStatus && <VpnBox data={displayData} />}
        {girdStatus && (
          <div
            ref={dropdownRef as React.RefObject<HTMLDivElement>}
            style={{ marginTop: 10 }}>
            {rightClick && (
              <div
                className="sol_tabultar_ly"
                style={{
                  display: 'block',
                  left: `${rightClickPosition.x}px`,
                  top: `${rightClickPosition.y}px`
                }}>
                {ActionData.map(actionItem => (
                  <ul
                    className="list-unstyled"
                    key={actionItem.id}
                    onClick={event => {
                      if (actionItem.disabled) {
                        event.preventDefault();
                        return;
                      }
                      event.stopPropagation();
                      handleActionTitleClick(actionItem);
                    }}>
                    <li>
                      <a
                        style={{
                          cursor: actionItem.disabled ? 'default' : 'pointer',
                          opacity: actionItem.disabled ? 0.5 : 1,
                          color: actionItem.id === 6 ? '#FE7366' : '#e1e7f0'
                        }}
                        onClick={event => {
                          if (actionItem.disabled || !actionItem.url) {
                            event.preventDefault();
                          }
                        }}
                        className="dropdown-item">
                        {actionItem.title}
                      </a>
                    </li>
                  </ul>
                ))}
              </div>
            )}
            <div className="table-responsive">
              <ReactTabulator
                key={tableKey}
                ref={tableRef}
                data={displayData}
                columns={allColumns}
                options={{
                  layout: 'fitColumns',
                  placeholder: 'No data found.',
                  pagination: 'local',
                  paginationSize: pageSize,
                  paginationSizeSelector: [10, 20, 50, 100],
                  paginationButtonCount: 0,
                  selectable: true
                  // movableColumns: true,
                  // movableRows: true,
                  // dataTree: true,
                  // dataTreeStartExpanded: true,
                }}
                events={{
                  renderStarted: renderStarted,
                  rowClick: rowClick,
                  rowContext: rowContext
                }}
              />
            </div>
          </div>
        )}
        {/* footer  */}
        <div className="sol_footer_pagenation fixed-bottom">
          <div className="row flex-grow-1 flex-nowrap">
            <PaginationBtn
              currentPage={currentPage}
              onFirstClick={handleFirstClick}
              onPrevClick={handlePrevClick}
              onNextClick={handleNextClick}
              onLastClick={handleLastClick}
              onNumberClick={handlePageClick}
              totalPages={totalPages}
              btnCnt={2}
              isFirstActive={currentPage > 1}
              isNextActive={currentPage < totalPages}
            />

            <div className="col d-flex justify-content-end">
              <RefreshData
                onRefreshClick={refreshData}
                refreshTime={refreshTime}
              />
              <PageSizeSelector
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                options={pageOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VpnPage;

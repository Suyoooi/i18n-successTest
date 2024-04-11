'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { ColumnDefinition, ReactTabulator } from 'react-tabulator';
import axios from 'axios';
import { formatDateTime } from '@/utils/dateTimeFormat';
import useRefreshData from '@/hook/useRefreshData';
import { pageOptions } from '@/types/grid';
import {
  ALERT_LEVEL_CRITICAL,
  ALERT_LEVEL_CRITICAL_VALUE,
  ALERT_LEVEL_INFO,
  ALERT_LEVEL_INFO_VALUE,
  ALERT_LEVEL_MAJOR,
  ALERT_LEVEL_MAJOR_VALUE,
  ALERT_LEVEL_MINOR,
  ALERT_LEVEL_MINOR_VALUE,
  ALERT_STATUS_ACT,
  ALERT_STATUS_ACT_VALUE,
  ALERT_STATUS_CNF,
  ALERT_STATUS_CNF_VALUE,
  ALERT_STATUS_DET,
  ALERT_STATUS_DET_VALUE,
  ALERT_STATUS_RES,
  ALERT_STATUS_RES_VALUE,
  ChartOrangeColor,
  ChartRedColor,
  ChartYellowColor,
  TYPE_EXCEPTION
} from '@/data/alert/alertData';
import { number } from 'echarts';
import * as xlsx from 'xlsx';
import {
  ALERT_DOWNLOAD_HEADER,
  DOWNLOAD_FILENM_EXCEP,
  FILE_EXT_EXCEL
} from '@/data/download/downHeader';
import RefreshData from '@/app/[locale]/components/footer/refreshData';
import PageSizeSelector from '@/app/[locale]/components/footer/pageSizeSelector';
import PaginationBtn from '@/app/[locale]/components/footer/paginationBtn';
import StackedBarChart from '@/app/[locale]/components/chart/eChart/stackedBarChart';

export default function AnomaliesDetectPage() {
  const router = useRouter();
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState(20);
  const [selectedVpn, setSelectedVpn] = useState<string>('');
  const [rightClick, setRightClick] = useState<boolean>(false);
  const [rightClickPosition, setRightClickPosition] = useState({ x: 0, y: 0 });
  const [series, setSeries] = useState<any[]>([]);
  const [gridDataInfo, setGridDataInfo] = useState<Date>();

  const tableKey = JSON.stringify({ pageSize });
  let tableRef = React.useRef<any>();
  const [dataInfo, setDataInfo] = useState<any[]>([]);
  const { refreshTime, refreshData } = useRefreshData(
    formatDateTime(new Date())
  );

  const totalPages = Math.ceil(totalDataCount / pageSize);

  // 첫 번째 버튼 클릭
  const handleFirstClick = () => {
    const pageSizeDiv = document.getElementById(
      'pagesize'
    ) as HTMLSelectElement;
    const newPageSize = Number(
      pageSizeDiv.options[pageSizeDiv.selectedIndex].value
    );

    getAlertTable(gridDataInfo, 1, newPageSize);
  };

  // 이전 버튼 클릭
  const handlePrevClick = () => {
    const prePage = Math.max(currentPage - 1, 1);
    const pageSizeDiv = document.getElementById(
      'pagesize'
    ) as HTMLSelectElement;
    const newPageSize = Number(
      pageSizeDiv.options[pageSizeDiv.selectedIndex].value
    );

    getAlertTable(gridDataInfo, prePage, newPageSize);
  };

  // 다음 버튼 클릭
  const handleNextClick = () => {
    const nextPage = Math.min(
      currentPage + 1,
      Math.ceil(totalDataCount / pageSize)
    );
    const pageSizeDiv = document.getElementById(
      'pagesize'
    ) as HTMLSelectElement;
    const newPageSize = Number(
      pageSizeDiv.options[pageSizeDiv.selectedIndex].value
    );

    getAlertTable(gridDataInfo, nextPage, newPageSize);
  };

  // 마지막 페이지 클릭
  const handleLastClick = () => {
    const pageSizeDiv = document.getElementById(
      'pagesize'
    ) as HTMLSelectElement;
    const newPageSize = Number(
      pageSizeDiv.options[pageSizeDiv.selectedIndex].value
    );

    getAlertTable(gridDataInfo, totalPages, newPageSize);
  };

  // 페이지 번호 클릭
  const handlePageClick = (pageNumber: number) => {
    const pageSizeDiv = document.getElementById(
      'pagesize'
    ) as HTMLSelectElement;
    const newPageSize = Number(
      pageSizeDiv.options[pageSizeDiv.selectedIndex].value
    );

    getAlertTable(gridDataInfo, pageNumber, newPageSize);
  };

  const fetchData = async () => {
    const alertHistoryUrl = `/api/v2/alertMgmt/summary`;
    try {
      // 현재 시간
      const offset = new Date().getTimezoneOffset() * 60000;
      const nowDt = new Date();
      const oneDayAgo = new Date(nowDt.setDate(nowDt.getDate() - 1) - offset);
      const stDt = oneDayAgo.toISOString().split('.')[0];

      const paramVal = {
        type: TYPE_EXCEPTION,
        recentHours: '23'
      };
      await axios
        .get(alertHistoryUrl, {
          params: paramVal,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          }
        })
        .then(function (res) {
          const resCode = res.data.responseCode;

          if (resCode === 200) {
            const dataVal = res.data.data;
            let unixStartLabel = 0;
            let unixLastLabel = 0;

            unixStartLabel = new Date(stDt).getTime();
            unixLastLabel = new Date().getTime();
            fnChartData(dataVal, unixLastLabel);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error('에러:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTime]);

  const fnChartData = (datas: any, dataLastLabel: any) => {
    if (dataLastLabel <= 0) return;
    const tickValue = 60 * 60 * 1000;
    const periodVal = 1000 * 60 * 60 * 24;
    // let startLabel = Math.ceil((dataLastLabel - periodVal + 1) / tickValue);
    let startLabel = Math.ceil((dataLastLabel - periodVal) / tickValue);
    let lastLabel = Math.ceil(dataLastLabel / tickValue);
    // let tickCount = lastLabel - startLabel + 1;
    let tickCount = lastLabel - startLabel;
    startLabel *= tickValue;
    lastLabel *= tickValue;

    const criticalData = {
      name: ALERT_LEVEL_CRITICAL_VALUE,
      type: 'bar',
      stack: 'total',
      color: [ChartRedColor],
      showSymbol: false,
      data: [],
      hashedData: Array.from({ length: tickCount }, (_, index) => {
        return [startLabel + index * tickValue, []];
      })
    };

    const majorData = {
      name: ALERT_LEVEL_MAJOR_VALUE,
      type: 'bar',
      stack: 'total',
      color: [ChartOrangeColor],
      showSymbol: false,
      data: [],
      hashedData: Array.from({ length: tickCount }, (_, index) => {
        return [startLabel + index * tickValue, []];
      })
    };

    const minorData = {
      name: ALERT_LEVEL_MINOR_VALUE,
      type: 'bar',
      stack: 'total',
      color: [ChartYellowColor],
      showSymbol: false,
      data: [],
      hashedData: Array.from({ length: tickCount }, (_, index) => {
        return [startLabel + index * tickValue, []];
      })
    };

    datas.forEach((item: any) => {
      const dateVal = item.date;
      const hourVal = ('0' + item.hour).slice(-2);
      const dtVal = dateVal.concat(' ').concat(hourVal).concat(':00:00');
      const newDt = new Date(dtVal).getTime();
      const index =
        newDt - startLabel > 0
          ? Math.ceil((newDt - startLabel) / tickValue)
          : 0;

      if (item.level === ALERT_LEVEL_CRITICAL) {
        (criticalData.hashedData[index][1] as any[]).push(item.count);
      } else if (item.level === ALERT_LEVEL_MAJOR) {
        (majorData.hashedData[index][1] as any[]).push(item.count);
      } else if (item.level === ALERT_LEVEL_MINOR) {
        (minorData.hashedData[index][1] as any[]).push(item.count);
      } else {
      }
    });

    const seriesData = [
      {
        ...minorData,
        data: Array.from(
          { length: minorData.hashedData.length },
          (_, index) => [
            minorData.hashedData[index][0],
            (minorData.hashedData[index][1] as any[]).length !== 0
              ? (minorData.hashedData[index][1] as any[])[0]
              : 0
          ]
        )
      },
      {
        ...majorData,
        data: Array.from(
          { length: majorData.hashedData.length },
          (_, index) => [
            majorData.hashedData[index][0],
            (majorData.hashedData[index][1] as any[]).length !== 0
              ? (majorData.hashedData[index][1] as any[])[0]
              : 0
          ]
        )
      },
      {
        ...criticalData,
        data: Array.from(
          { length: criticalData.hashedData.length },
          (_, index) => [
            criticalData.hashedData[index][0],
            (criticalData.hashedData[index][1] as any[]).length !== 0
              ? (criticalData.hashedData[index][1] as any[])[0]
              : 0
          ]
        )
      }
    ];

    setSeries(seriesData);
  };

  const onChartClick = (params: any) => {
    const dataIndex = params.dataIndex;
    const dataVal = params.value[0];
    const gridDate = new Date(dataVal);

    let totalCnt = 0;

    for (let index = 0; index < series.length; index++) {
      if (series[index] && series[index].hashedData[dataIndex].length > 0) {
        totalCnt = totalCnt + Number(series[index].hashedData[dataIndex][1]);
      }
    }

    setTotalDataCount(totalCnt);
    setGridDataInfo(gridDate);
    getAlertTable(gridDate, 1, pageSize);
  };

  const getAlertTable = async (
    gridDate: any,
    pageNum: any,
    pageSizeVal: any
  ) => {
    const alertHistoryUrl = `/api/v2/alertMgmt/timeSlotHistory`;

    try {
      let dtYmd = '';
      let dtHour = '';
      if (gridDate && gridDate != null) {
        dtYmd = dateFormatYmd(gridDate);
        dtHour = dateFormatHour(gridDate);
      } else {
        dtYmd = dateFormatYmd(gridDataInfo);
        dtHour = dateFormatHour(gridDataInfo);
      }

      setCurrentPage(pageNum);

      if (dtYmd && dtYmd != null && dtHour != null) {
        const paramVal = {
          type: TYPE_EXCEPTION,
          date: dtYmd,
          hour: dtHour,
          pageNumber: pageNum - 1,
          pageSize: pageSizeVal
        };
        await axios
          .get(alertHistoryUrl, {
            params: paramVal,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Access-Control-Allow-Origin': '*'
            }
          })
          .then(function (res) {
            const resCode = res.data.responseCode;

            if (resCode === 200) {
              const dataVal = res.data.data;
              setDataInfo(dataVal);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const dateFormat = (value: any) => {
    const timeVal = new Date(value);
    const year = timeVal.getFullYear();
    const month = ('0' + (timeVal.getMonth() + 1)).slice(-2);
    const day = ('0' + timeVal.getDate()).slice(-2);
    const hour = ('0' + timeVal.getHours()).slice(-2);
    const minute = ('0' + timeVal.getMinutes()).slice(-2);
    const second = ('0' + timeVal.getSeconds()).slice(-2);
    const dateStr = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return dateStr;
  };

  const dateFormatYmd = (value: any) => {
    const timeVal = new Date(value);
    const year = timeVal.getFullYear();
    const month = ('0' + (timeVal.getMonth() + 1)).slice(-2);
    const day = ('0' + timeVal.getDate()).slice(-2);
    const dateStr = `${year}-${month}-${day}`;
    return dateStr;
  };

  const dateFormatHour = (value: any) => {
    const timeVal = new Date(value);
    const hour = ('0' + timeVal.getHours()).slice(-2);
    const dateStr = `${hour}`;
    return dateStr;
  };

  const downloadDateFormat = (value: any) => {
    const timeVal = new Date(value);
    const year = timeVal.getFullYear();
    const month = ('0' + (timeVal.getMonth() + 1)).slice(-2);
    const day = ('0' + timeVal.getDate()).slice(-2);
    const hour = ('0' + timeVal.getHours()).slice(-2);
    const minute = ('0' + timeVal.getMinutes()).slice(-2);
    const second = ('0' + timeVal.getSeconds()).slice(-2);
    const dateStr = `${year}${month}${day}${hour}${minute}${second}`;
    return dateStr;
  };

  const vpnColumn: ColumnDefinition[] = [
    {
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
                table.modules.selectRow.registerRowSelectCheckbox(
                  row,
                  checkbox
                );
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
                table.modules.selectRow.registerRowSelectCheckbox(
                  row,
                  checkbox
                );
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
    },
    {
      title: 'Time',
      field: 'datetime',
      hozAlign: 'left',
      // sorter: "string",
      headerSort: false,
      width: 160,
      formatter: function (cell, formatterParams, onRendered) {
        const value = cell.getValue();
        const dateStr = dateFormat(value);
        return `<span">${dateStr}</span>`;
      }
    },
    {
      title: 'Severity',
      field: 'level',
      hozAlign: 'left',
      // sorter: "string",
      headerSort: false,
      width: 100,
      formatter: function (cell, formatterParams, onRendered) {
        const value = cell.getValue();
        let classNm = '';
        let valueVal = '';

        if (value === ALERT_LEVEL_CRITICAL) {
          classNm = 'sol_color_red';
          valueVal = ALERT_LEVEL_CRITICAL_VALUE;
        } else if (value === ALERT_LEVEL_MAJOR) {
          classNm = 'sol_color_orange';
          valueVal = ALERT_LEVEL_MAJOR_VALUE;
        } else if (value === ALERT_LEVEL_MINOR) {
          classNm = 'sol_color_yellow';
          valueVal = ALERT_LEVEL_MINOR_VALUE;
        } else if (value === ALERT_LEVEL_INFO) {
          classNm = 'sol_color_green';
          valueVal = ALERT_LEVEL_INFO_VALUE;
        }

        return `<span class="${classNm}">${valueVal}</span>`;
      }
    },
    {
      title: 'Alert Rule Name',
      field: 'title',
      hozAlign: 'left',
      // sorter: "string",
      headerSort: false
    },
    {
      title: 'Status',
      field: 'status',
      hozAlign: 'left',
      // sorter: "string",
      headerSort: false,
      width: 100,
      formatter: function (cell, formatterParams, onRendered) {
        const value = cell.getValue();
        let valueVal = '';

        if (value === ALERT_STATUS_DET) {
          valueVal = ALERT_STATUS_DET_VALUE;
        } else if (value === ALERT_STATUS_ACT) {
          valueVal = ALERT_STATUS_ACT_VALUE;
        } else if (value === ALERT_STATUS_CNF) {
          valueVal = ALERT_STATUS_CNF_VALUE;
        } else if (value === ALERT_STATUS_RES) {
          valueVal = ALERT_STATUS_RES_VALUE;
        }

        return `<span>${valueVal}</span>`;
      }
    },
    {
      title: 'Owner',
      field: 'assignee',
      hozAlign: 'left',
      // sorter: "string",
      headerSort: false,
      width: 150
    }
  ];

  const options = {
    layout: 'fitColumns',
    maxHeight: 390,
    page: currentPage,
    size: pageSize,
    pagination: 'remote',
    paginationSize: pageSize,
    placeholder: 'No data found.'
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

  // react-tabulator footer 없애는 로직
  const renderStarted = async (e: any) => {
    const el = document.getElementsByClassName(
      'tabulator-footer'
    )[0] as HTMLElement;
    el.style.display = 'none';
  };

  // row 우클릭
  const rowContext = (e: any, row: any) => {
    e.preventDefault();
    const tableInfo = tableRef.current.table;
    const rowClickData = row.getData().msgVpnName;
    setSelectedVpn(rowClickData);
    console.log('선택한 row 값:::', rowClickData);
    if (tableInfo) {
      tableInfo.deselectRow();
      row.select();
      // 마우스 위치를 가져옴
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      setRightClickPosition({ x: mouseX, y: mouseY });
      setRightClick(true);
    }
  };

  // 페이지 변경 핸들러
  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSize = Number(event.target.value);
    setPageSize(newSize);
    const newTotalPages = Math.ceil(totalDataCount / newSize);
    setCurrentPage(current => Math.min(current, newTotalPages));
    getAlertTable(gridDataInfo, 1, newSize);
  };

  const fnExcelDown = async () => {
    const alertHistoryUrl = `/api/v2/alertMgmt/timeSlotHistory`;

    try {
      const dtYmd = dateFormatYmd(gridDataInfo);
      const dtHour = dateFormatHour(gridDataInfo);

      if (dtYmd && dtYmd != null && dtHour != null) {
        const paramVal = {
          type: TYPE_EXCEPTION,
          date: dtYmd,
          hour: dtHour,
          pageNumber: 0,
          pageSize: 100000000
        };
        await axios
          .get(alertHistoryUrl, {
            params: paramVal,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Access-Control-Allow-Origin': '*'
            }
          })
          .then(function (res) {
            const resCode = res.data.responseCode;

            if (resCode === 200) {
              const dataVal = res.data.data;

              if (dataVal && dataVal != null) {
                const excelData: any = [];
                const headerData = ALERT_DOWNLOAD_HEADER;

                const nowDt = new Date();
                const fileDownDt = downloadDateFormat(nowDt);

                const fileNm = DOWNLOAD_FILENM_EXCEP.concat('_')
                  .concat(fileDownDt)
                  .concat(FILE_EXT_EXCEL);

                dataVal.forEach((datas: any, idx: number) => {
                  const concatVal: any = {};
                  concatVal.time = dateFormat(datas.datetime);

                  let levelVal = '';
                  if (datas.level === ALERT_LEVEL_CRITICAL) {
                    levelVal = ALERT_LEVEL_CRITICAL_VALUE;
                  } else if (datas.level === ALERT_LEVEL_MAJOR) {
                    levelVal = ALERT_LEVEL_MAJOR_VALUE;
                  } else if (datas.level === ALERT_LEVEL_MINOR) {
                    levelVal = ALERT_LEVEL_MINOR_VALUE;
                  }
                  concatVal.severity = levelVal;
                  concatVal.alertRuleNm = datas.title;

                  let statusVal = '';
                  if (datas.status === ALERT_STATUS_DET) {
                    statusVal = ALERT_STATUS_DET_VALUE;
                  } else if (datas.status === ALERT_STATUS_ACT) {
                    statusVal = ALERT_STATUS_ACT_VALUE;
                  } else if (datas.status === ALERT_STATUS_CNF) {
                    statusVal = ALERT_STATUS_CNF_VALUE;
                  } else if (datas.status === ALERT_STATUS_RES) {
                    statusVal = ALERT_STATUS_RES_VALUE;
                  }
                  concatVal.status = statusVal;
                  concatVal.owner = datas.owner;

                  excelData.push(concatVal);
                });

                const wb = xlsx.utils.book_new();
                const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet([]);

                xlsx.utils.sheet_add_aoa(ws, headerData);
                xlsx.utils.sheet_add_json(ws, excelData, {
                  origin: 'A2',
                  skipHeader: true
                });
                xlsx.utils.book_append_sheet(wb, ws, 'data');

                const jsonKeys = Object.keys(excelData[0]);
                let objectMaxLength: any[] = [];
                for (let i = 0; i < excelData.length; i++) {
                  let value = excelData[i];
                  console.log(value);
                  for (let j = 0; j < jsonKeys.length; j++) {
                    if (typeof value[jsonKeys[j]] == 'number') {
                      objectMaxLength[j] = 10;
                    } else {
                      const l = value[jsonKeys[j]]
                        ? value[jsonKeys[j]].length
                        : 0;

                      objectMaxLength[j] =
                        objectMaxLength[j] >= l ? objectMaxLength[j] : l;
                    }
                  }

                  let key = jsonKeys;
                  for (let j = 0; j < key.length; j++) {
                    objectMaxLength[j] =
                      objectMaxLength[j] >= key[j].length
                        ? objectMaxLength[j]
                        : key[j].length;
                  }
                }

                const wscols = objectMaxLength.map(w => {
                  return { width: w };
                });
                const wscolVal = wscols.with(2, { width: 100 });
                ws['!cols'] = wscolVal;

                xlsx.writeFile(wb, fileNm);
              }
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="tab-content">
        <div className="col">
          <div className="sol_box_p0" style={{ height: 250 }}>
            <StackedBarChart
              seriesInfo={series}
              widthVal={'100%'}
              heightVal={'240px'}
              onChartClick={onChartClick}
            />
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <div className="btn-group">
            <a
              className="btn hstack btn-outline-light"
              data-bs-toggle="dropdown">
              Action
            </a>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item disabled">
                  <span className="sol_color_point">Delete</span>
                </a>
              </li>
            </ul>
          </div>
          <a className="btn hstack btn-outline-secondary" onClick={fnExcelDown}>
            Excel Download
          </a>
        </div>

        <div className="table-responsive">
          <ReactTabulator
            key={tableKey}
            ref={tableRef}
            autoResize={true}
            data={dataInfo}
            columns={vpnColumn}
            options={options}
            events={{
              renderStarted: renderStarted
              // rowContext: rowContext,
            }}
          />
        </div>
      </div>

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
            btnCnt={4}
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
    </>
  );
}

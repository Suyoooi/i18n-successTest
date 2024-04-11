'use client';

import Link from 'next/link';
import React, {
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  useCallback
} from 'react';
import axios from 'axios';
import qs from 'qs';
import { useAppDispatch, useAppSelector } from '@/hook/hook';
import { useRouter, usePathname } from 'next/navigation';
import { selectQueueList } from '@/data/selectType';
import { reactFormatter } from '@/utils/utils';
import { pageOptions } from '@/types/grid';
import RefreshData from '@/app/[locale]/components/footer/refreshData';
import { formatDateTime } from '@/utils/dateTimeFormat';
import useRefreshData from '@/hook/useRefreshData';
import PaginationBtn from '@/app/[locale]/components/footer/paginationBtn';
import PageSizeSelector from '@/app/[locale]/components/footer/pageSizeSelector';
import Modal from '@/app/[locale]/components/queue/modal';
import { closeModal, openModal } from '@/redux/slices/modal/modalSlice';
import { setSelectedQueue } from '@/redux/slices/queue/queueSlice';
import { ReactTabulator } from 'react-tabulator';
import {
  PROGRESS_BAR_BACK,
  PROGRESS_BAR_BLUE,
  PROGRESS_BAR_ORANGE,
  PROGRESS_BAR_RED
} from '@/data/color/chartColor';

axios.defaults.paramsSerializer = params => {
  return qs.stringify(params, { arrayFormat: 'repeat' });
};

export default function QueueList() {
  const tableRef = useRef<ReactTabulator | null>(null);
  const dispatch = useAppDispatch();
  const [tableData, setTableData] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const tableKey = JSON.stringify({ pageSize });
  const [searchTerm, setSearchTerm] = useState('');
  const [rightClick, setRightClick] = useState<boolean>(false);
  const [rightClickPosition, setRightClickPosition] = useState({ x: 0, y: 0 });
  const { refreshTime, refreshData } = useRefreshData(
    formatDateTime(new Date())
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const totalPages = Math.ceil(totalDataCount / pageSize);

  const pathname = usePathname();
  const router = useRouter();

  const handleCreateQueueBtnClick = () => {
    setIsModalOpen(true);
    dispatch(openModal());
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(closeModal());
  };

  const selectedVpn = useAppSelector(state => state.isVpn.selectedRow);
  const selectedId = useAppSelector(state => state.isVpn.selectedId);
  const selectedQueue = useAppSelector(state => state.queue.selectedQueue);

  const onClickToggleModal = useCallback(() => {
    if (isModalOpen) {
      handleCloseModal();
    } else {
      handleCreateQueueBtnClick();
    }
  }, [isModalOpen]);

  const vpnNm = selectedVpn?.msgVpnName;
  const vpnId = selectedId?.mlsnSn;
  const headerInfo = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  };

  const columns: any = [
    // {
    //   title: "",
    //   width: 40,
    //   formatter: "rowSelection",
    //   titleFormatter: "rowSelection",
    //   hozAlign: "center",
    //   headerSort: false,
    //   cssClass: "text-center",
    //   frozen: true,
    // },
    {
      title: '',
      width: 40,
      formatter: function (cell: any, formatterParams: any, onRendered: any) {
        // const data = cell.getRow().getData();
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
      // titleFormatter: "rowSelection",
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
      title: 'Queue Name',
      field: 'queueName',
      hozAlign: 'left',
      width: 220
    },
    {
      title: 'Incoming',
      field: 'ingressEnabled',
      hozAlign: 'left',
      width: 90,
      formatter: function (cell: any) {
        var value = cell.getValue();
        if (value) {
          return 'On';
        } else {
          return 'Off';
        }
      }
    },
    {
      title: 'Outgoing',
      field: 'egressEnabled',
      hozAlign: 'left',
      width: 90,
      formatter: function (cell: any) {
        var value = cell.getValue();
        if (value) {
          return 'On';
        } else {
          return 'Off';
        }
      }
    },
    {
      title: 'Access Type',
      field: 'accessType',
      hozAlign: 'left',
      width: 120
    },
    {
      title: 'Partition Count',
      field: 'partitionCount',
      hozAlign: 'left',
      width: 130,
      formatter: function (cell: any) {
        return setCommaNum(cell.getValue());
      }
    },
    {
      title: 'Messages Queued (%)',
      field: 'eventMsgSpoolUsageThreshold',
      hozAlign: 'left',
      headerSort: false,
      width: 200,
      formatter: reactFormatter(<ProgressInfo />)
    },
    {
      title: 'Messages Queued (msgs)',
      field: 'messageQueued',
      hozAlign: 'left',
      width: 220,
      formatter: function (cell: any) {
        if (typeof cell.getValue() !== 'undefined') {
          return setCommaNum(cell.getValue());
        } else {
          return '';
        }
      }
    },
    {
      title: 'Messages Queued (MB)',
      field: 'msgSpoolUsage',
      hozAlign: 'left',
      width: 200,
      formatter: function (cell: any) {
        if (typeof cell.getValue() !== 'undefined') {
          return FormatBytesToMb(cell.getValue());
        } else {
          return '';
        }
      }
    },
    {
      title: 'Messages Queued Quota (MB)',
      field: 'maxMsgSpoolUsage',
      hozAlign: 'left',
      width: 240
    },
    // { title: "Consumers", field: "bindCount", headerTooltip: true, hozAlign: "left" },
    // { title: "Replay State", field: "replayState", headerTooltip: true, hozAlign: "left" },
    {
      title: 'Durable',
      field: 'durable',
      hozAlign: 'left',
      width: 90,
      formatter: function (cell: any) {
        var value = cell.getValue();
        if (value) {
          return 'Yes';
        } else {
          return 'No';
        }
      }
    }
  ];

  function ProgressInfo(props: any) {
    const rowData = props.cell._cell.row.data;
    const msgSpoolUsage = FormatBytesToMb(rowData.msgSpoolUsage);
    const maxMsgSpoolUsage = rowData.maxMsgSpoolUsage;
    const progressVal = Math.round((msgSpoolUsage / maxMsgSpoolUsage) * 100);
    const progId = rowData.queueName.concat('_prog');
    const idVal = progId.replace(/\\s+/g, '');
    const fillUrl = 'url(#' + idVal + ')';

    const progs = parseInt(progressVal.toFixed(1)) / 100;

    let progressColor = PROGRESS_BAR_BLUE;
    if (progs > 0 && progs < 0.75) {
      progressColor = PROGRESS_BAR_BLUE;
    } else if (progs >= 0.75 && progs < 0.9) {
      progressColor = PROGRESS_BAR_ORANGE;
    } else if (progs >= 0.9) {
      progressColor = PROGRESS_BAR_RED;
    }

    return (
      <>
        <div className="row col-md-12">
          <div className="col-sm-11 progress">
            <svg>
              <defs>
                <linearGradient id={progId}>
                  <stop offset="0" stop-color={progressColor}>
                    <animate
                      dur="2s"
                      attributeName="offset"
                      fill="freeze"
                      from="0"
                      to={progs}
                    />
                  </stop>
                  <stop offset="0" stop-color={PROGRESS_BAR_BACK}>
                    <animate
                      dur="2s"
                      attributeName="offset"
                      fill="freeze"
                      from="0"
                      to={progs}
                    />
                  </stop>
                </linearGradient>
              </defs>
              <rect
                id="Rectangle"
                x="0"
                y="0"
                width="120"
                height="10"
                rx="4"
                fill={fillUrl}>
                <title>{progressVal | 0} %</title>
              </rect>
            </svg>
          </div>
          <div className="col-sm-1">{progressVal | 0} %</div>
        </div>
      </>
    );
  }

  const setCommaNum = (num: any) => {
    if (num && num >= -1) {
      const numVal = num.toLocaleString('ko-KR');
      return numVal;
    } else {
      return 0;
    }
  };

  function FormatBytes(bytes: any, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const parseData = parseFloat(
      (bytes / Math.pow(k, i)).toFixed(dm >= 0 && dm <= 20 ? dm : 2)
    );
    const parseVal = parseData.toLocaleString('ko-KR') + ' ' + sizes[i];

    return parseVal;
  }

  function FormatBytesToMb(bytes: any) {
    const k = 1024;
    const parseData = parseFloat((bytes / Math.pow(k, 2)).toFixed(4));
    return parseData;
  }

  const options = {
    // layout: "fitDataFill",
    layout: 'fitColumns',
    // maxHeight: 500,
    // width: '100%',
    pagination: true,
    paginationSize: pageSize,
    placeholder: 'No data found.'
    // initialSort: [{ column: "messageQueued", dir: "desc" }],
  };

  const [searchInfo, setSearchInfo] = useState({
    sQueueNm: ''
  });
  const { sQueueNm } = searchInfo;

  function onChangeSearch(e: { target: { value: any; name: any } }) {
    console.log(e.target);
    const { value, name } = e.target;
    setSearchInfo({
      ...searchInfo,
      [name]: value
    });
  }

  const fetchTableData = async () => {
    try {
      if (vpnNm && vpnNm != '') {
        const getQueueUrl = `/api/v2/msgVpns/${vpnId}/queues/list`;

        console.log('vpn >>>> ', getQueueUrl);

        const getParamsVal = {
          count: 100000,
          cursor: '',
          where: sQueueNm,
          select: selectQueueList
        };

        console.log(getParamsVal);

        await axios
          .get(getQueueUrl, {
            params: getParamsVal,
            headers: headerInfo,
            paramsSerializer: params => {
              return qs.stringify(params, { arrayFormat: 'repeat' });
            }
          })
          .then(function (response) {
            const resCode = response.data.meta.responseCode;
            console.log(resCode);
            console.log(response.data.data);
            console.log(response.data.meta.paging);
            if (resCode === 200) {
              const dataVal = response.data.data;
              setTableData(dataVal);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        alert('No Selected VPN');
      }
    } catch (err) {
      console.error('Error fetching table data:', err);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [pageSize, refreshTime]);

  useEffect(() => {
    // 검색어 필터링
    const filteredData = tableData.filter((item: any) =>
      item.queueName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalFilteredData = filteredData.length;
    setTotalDataCount(totalFilteredData);
    // 시작 인덱스
    const begin = (currentPage - 1) * pageSize;
    // 끝 인덱스
    const end = begin + pageSize;
    const currentData = filteredData.slice(begin, end);
    // 보여줄 데이터 === 현재 데이터
    setDisplayData(currentData);
  }, [currentPage, pageSize, tableData, searchTerm]);

  const handleSearchChange = (e: any) => {
    console.log(e.target.value);
    setSearchTerm(e.target.value);
  };

  const handleKeydownInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.code !== 'Enter') return;

    fetchTableData();
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSize = Number(event.target.value);
    setPageSize(newSize);

    const newTotalPages = Math.ceil(totalDataCount / newSize);
    setCurrentPage(current => Math.min(current, newTotalPages));
  };

  const renderStarted = async (e: any) => {
    const el = document.getElementsByClassName(
      'tabulator-footer'
    )[0] as HTMLElement;
    el.style.display = 'none';
  };

  const rowClick = (e: any, row: any) => {
    const queueNm = row.getData().queueName;
    dispatch(setSelectedQueue({ queueName: queueNm }));

    router.push('/channel');
  };

  const rowContext = (e: any, row: any) => {
    e.preventDefault();
    const tableInfo = tableRef.current?.table;
    const rowClickData = row.getData().queueName;

    console.log(tableInfo);

    if (tableInfo) {
      tableInfo.deselectRow();
      row.select();

      const mouseX = e.clientX;
      const mouseY = e.clientY;
      setRightClickPosition({ x: mouseX, y: mouseY });
      setRightClick(true);
    }
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

  const fnGoSummary = () => {
    const tableInfo = tableRef.current;
    console.log(tableInfo);

    if (tableInfo) {
      console.log('aaaa');
      const selectedData = tableInfo?.table.getSelectedData();
      console.log(selectedData);
      const queueNm = selectedData[0].queueName;

      dispatch(setSelectedQueue({ queueName: queueNm }));
    }

    const paths = `/channel`;
    router.push(paths);
  };

  const fnGoSetting = () => {
    const tableInfo = tableRef.current;

    if (tableInfo) {
      const selectedData = tableInfo?.table.getSelectedData();
      if (selectedData && selectedData.length > 0) {
        const queueNm = selectedData[0].queueName;
        dispatch(setSelectedQueue({ queueName: queueNm }));
        router.push('/channel/settings');
      }
    }
  };

  const fnGoReplay = () => {};

  const fnDelAllMsg = async () => {
    const tableInfo = tableRef.current;
    if (tableInfo) {
      const selectedData = tableInfo?.table.getSelectedData();

      if (selectedData && selectedData.length > 0) {
        if (confirm('All messages will be deleted. Are you sure?')) {
          for (var i = 0; i < selectedData.length; i++) {
            const base64QueueNm = Buffer.from(
              selectedData[i].queueName
            ).toString('base64');
            const delQueueMsgUrl = `/api/v2/msgVpns/${vpnId}/queues/${base64QueueNm}/deleteMsgs`;
            await axios
              .put(delQueueMsgUrl, {
                headers: headerInfo
              })
              .then(function (response) {
                const resCode = response.data.meta.responseCode;
                if (resCode && resCode === 200) {
                  setRightClick(false);
                  fetchTableData();
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        }
      }
    }
  };

  const fnClone = () => {};

  const fnDelQueues = async () => {
    const tableInfo = tableRef.current;
    if (tableInfo) {
      const selectedData = tableInfo?.table.getSelectedData();

      if (selectedData && selectedData.length > 0) {
        if (confirm('Selected Queue(s) will be deleted. Are you sure?')) {
          for (var i = 0; i < selectedData.length; i++) {
            const base64QueueNm = Buffer.from(
              selectedData[i].queueName
            ).toString('base64');
            const delQueueMsgUrl = `/api/v2/msgVpns/${vpnId}/queues/${base64QueueNm}`;
            await axios
              .delete(delQueueMsgUrl, {
                headers: headerInfo
              })
              .then(function (response) {
                const resCode = response.data.meta.responseCode;
                if (resCode && resCode === 200) {
                  setRightClick(false);
                  fetchTableData();
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        }
      }
    }
  };

  // 첫 번째 버튼 클릭
  const handleFirstClick = () => {
    setCurrentPage(1);
  };
  // 이전 버튼 클릭
  const handlePrevClick = () => {
    setCurrentPage(currentPage => Math.max(currentPage - 1, 1));
  };
  // 다음 버튼 클릭
  const handleNextClick = () => {
    setCurrentPage(currentPage =>
      Math.min(currentPage + 1, Math.ceil(tableData.length / pageSize))
    );
  };
  // 마지막 페이지 클릭
  const handleLastClick = () => {
    setCurrentPage(totalPages);
  };
  // 페이지 번호 클릭
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleActionClick = () => {
    if (tableRef.current) {
      // const selectedDataValue = tableRef.current.getSelectedData();
      const selectedDataValue = tableRef.current.table;
      const selectedInfo = selectedDataValue.getSelectedData();

      setSelectedRows(selectedDataValue);

      const singleMenuList = document.querySelectorAll("[id='singleMenu']");
      const multiMenuList = document.querySelectorAll("[id='multiMenu']");
      const singleDisMenuList = document.querySelectorAll(
        "[id='singleMenu_disabled']"
      );

      if (selectedInfo && selectedInfo.length > 0) {
        if (selectedInfo.length > 1) {
          for (var i = 0; i < singleMenuList.length; i++) {
            singleMenuList[i].classList.add('disabled');
          }

          for (var i = 0; i < multiMenuList.length; i++) {
            multiMenuList[i].classList.remove('disabled');
          }
        } else {
          for (var i = 0; i < singleMenuList.length; i++) {
            singleMenuList[i].classList.remove('disabled');
          }

          for (var i = 0; i < multiMenuList.length; i++) {
            multiMenuList[i].classList.remove('disabled');
          }
        }
      } else {
        for (var i = 0; i < singleMenuList.length; i++) {
          singleMenuList[i].classList.add('disabled');
        }

        for (var i = 0; i < multiMenuList.length; i++) {
          multiMenuList[i].classList.add('disabled');
        }

        for (var i = 0; i < singleDisMenuList.length; i++) {
          singleDisMenuList[i].classList.add('disabled');
        }
      }
    }
  };

  return (
    <>
      <div className="tab-content">
        {isModalOpen && <Modal onClickToggleModal={onClickToggleModal} />}
        <div className="row">
          <div className="col-md-8">
            <div className="sol_cont_search row no-gutters gap-2">
              <input
                type="text"
                className="form-control sol_input_search"
                id="sQueueNm"
                name="sQueueNm"
                placeholder="Queue Name Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="col-md-4 d-flex justify-content-end gap-2">
            <div className="btn-group">
              <Link
                href={'#'}
                className="btn hstack btn-outline-light"
                data-bs-toggle="dropdown"
                onClick={handleActionClick}>
                Action
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <a
                    className="dropdown-item"
                    id="singleMenu"
                    onClick={event => {
                      event.stopPropagation();
                      fnGoSummary();
                    }}>
                    Go to Summary
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    id="singleMenu"
                    onClick={event => {
                      event.stopPropagation();
                      fnGoSetting();
                    }}>
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item disabled"
                    id="singleMenu_disabled"
                    onClick={event => {
                      event.stopPropagation();
                      fnGoReplay();
                    }}>
                    Go to Replay
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    id="multiMenu"
                    onClick={event => {
                      event.stopPropagation();
                      fnDelAllMsg();
                    }}>
                    Delete All Messages
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item disabled"
                    id="singleMenu_disabled"
                    onClick={event => {
                      event.stopPropagation();
                      fnClone();
                    }}>
                    Clone
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    id="multiMenu"
                    onClick={event => {
                      event.stopPropagation();
                      fnDelQueues();
                    }}>
                    <span className="sol_color_point">Delete</span>
                  </a>
                </li>
              </ul>
            </div>
            <a
              className="btn hstack btn-outline-info"
              onClick={handleCreateQueueBtnClick}>
              + Queue
            </a>
          </div>
        </div>
        {rightClick && (
          <div ref={dropdownRef as React.RefObject<HTMLDivElement>}>
            <div
              className="sol_tabultar_ly"
              style={{
                display: 'block',
                left: `${rightClickPosition.x}px`,
                top: `${rightClickPosition.y}px`
              }}>
              <ul className="list-unstyled">
                <li>
                  <a
                    className="dropdown-item"
                    id="singleMenu"
                    onClick={event => {
                      event.stopPropagation();
                      fnGoSummary();
                    }}>
                    Go to Summary
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    id="singleMenu"
                    onClick={event => {
                      event.stopPropagation();
                      fnGoSetting();
                    }}>
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item disabled"
                    id="singleMenu_disabled"
                    onClick={event => {
                      event.stopPropagation();
                      fnGoReplay();
                    }}>
                    Go to Replay
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    id="multiMenu"
                    onClick={event => {
                      event.stopPropagation();
                      fnDelAllMsg();
                    }}>
                    Delete All Messages
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item disabled"
                    id="singleMenu_disabled"
                    onClick={event => {
                      event.stopPropagation();
                      fnClone();
                    }}>
                    Clone
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    id="multiMenu"
                    onClick={event => {
                      event.stopPropagation();
                      fnDelQueues();
                    }}>
                    <span className="sol_color_point">Delete</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
        <div className="table-responsive">
          <ReactTabulator
            key={tableKey}
            // onRef={(ref) => (tableRef.current = ref.current)}
            ref={tableRef}
            autoResize={true}
            data={displayData}
            columns={columns}
            options={options}
            events={{
              renderStarted: renderStarted,
              rowClick: rowClick,
              rowContext: rowContext
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
    </>
  );
}

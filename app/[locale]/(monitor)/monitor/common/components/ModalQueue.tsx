import {
  RES_HEADER_LABEL_VPN,
  RES_MLSN_PLACEHOLDER,
  RES_QUEUE_MODAL_APPLY,
  RES_QUEUE_MODAL_CANCEL,
  RES_QUEUE_MODAL_DISPLAY_LIST_HINT,
  RES_QUEUE_MODAL_MONITOR_LIST_HINT,
  RES_QUEUE_MODAL_MONITOR_LIST_TITLE
} from '@/data/monitor/resources';
import { useAppDispatch, useAppSelector } from '@/hook/hook';
import {
  MonitorQueueState,
  controlManualModal,
  updateManualQueueList
} from '@/redux/slices/monitoring-queue/reducer';
import { MonitorState } from '@/redux/slices/monitoring/reducer';
import { createSelector } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { getAllQueueList, getQueueList } from '../../helpers/api_helper';

const ModalQueue = (props: any) => {
  const dispatch: any = useAppDispatch();
  const selectMonitorData = createSelector(
    (state: any) => state.monitorHeader,
    (monitoringData: MonitorState) => ({
      nodeInfo: monitoringData.nodeInfo,
      curNode: monitoringData.curNode
    })
  );
  const monitoringMonitorData = useAppSelector(selectMonitorData);
  const selectQueueData = createSelector(
    (state: any) => state.monitorQueue,
    (monitoringData: MonitorQueueState) => ({
      manualQueueList: monitoringData.manualQueueList
    })
  );
  const monitoringQueueData = useAppSelector(selectQueueData);
  const mlsnPlaceHolder = {
    value: {},
    label: RES_MLSN_PLACEHOLDER,
    serverType: ''
  };

  const [mlsnOptions, setMlsnOptions] = useState<any[]>([mlsnPlaceHolder]);
  const [mlsnIndex, setMlsnIndex] = useState<number>(0);

  /* 최초 1회 실행 */
  useEffect(() => {
    if (
      monitoringMonitorData.nodeInfo &&
      monitoringMonitorData.nodeInfo.nodeList.length > 0
    ) {
      const data: any[] = [mlsnPlaceHolder];
      for (let node of monitoringMonitorData.nodeInfo.nodeList) {
        for (let lsn of node.mlsns) {
          data.push({
            value: { msn: node.msn, mlsn: lsn },
            label: `${node.msn} > ${lsn}`,
            serverType: node.serverType
          });
        }
      }
      if (data.length > 0) {
        let matchedIndex = 0; // 0 => placeholder
        setMlsnOptions(data);
        if (
          monitoringMonitorData.curNode &&
          monitoringMonitorData.curNode.msn &&
          monitoringMonitorData.curNode.mlsn
        ) {
          matchedIndex = data.findIndex(
            (item: any) =>
              item.value.msn === monitoringMonitorData.curNode.msn &&
              item.value.mlsn === monitoringMonitorData.curNode.mlsn
          );
          if (matchedIndex > 0) {
            // mlsn 이 선택 되었다.
            setMlsnIndex(matchedIndex);
          }
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [mlsnAllQueueList, setMlsnAllQueueList] = useState<any[]>([]);
  const [displayQueueList, setDisplayQueueList] = useState<any[]>([]);
  const [monitorQueueList, setMonitorQueueList] = useState<any[]>([]);

  const handleMlsnIndex = (index: number) => {
    setMlsnAllQueueList([]);
    setDisplayQueueList([]);
    setMonitorQueueList([]);
    setMlsnIndex(index);
    // todo : 목록을 가져와서 처리해야 하는데 저장된 monitorQueue 정보를 보여주는것은 않될 듯 하다.
    // if(monitoringQueueData.manualQueueList.length > 0) {
    //     const matchedList = monitoringQueueData.manualQueueList.find(element => (element.msn === mlsnOptions[mlsnIndex].value.msn && element.mlsn === mlsnOptions[mlsnIndex].value.mlsn));
    //     if(matchedList) setMonitorQueueList(matchedList.queues.map((queue: string) => { return {select: false, queue: queue} }));
    // }
  };

  const [searchQueue, setSearchQueue] = useState<string>();
  const loadAllQueueList = async (
    msn: string,
    mlsn: string,
    searchString: string
  ) => {
    try {
      const response = await getAllQueueList({
        msn: msn,
        mlsn: mlsn,
        searchParam: btoa(searchString),
        count: 100
      });
      const serverResponse = response.data ? response.data : response;
      if (serverResponse.responseCode < 400 && serverResponse.data) {
        const queueList = serverResponse.data?.queueNames ?? []; // array type
        const allList = queueList.map((item: string) => {
          return { pos: 'left', checked: false, queue: item };
        });
        setMlsnAllQueueList(allList);
        setDisplayQueueList(allList);
        setMonitorQueueList([]);
      }
    } catch (error: any) {
      console.log('error:' + error?.response?.data ?? 'unknown error');
    }
  };
  const handleSearchKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      if (mlsnIndex > 0 && searchQueue && searchQueue.length > 0) {
        loadAllQueueList(
          mlsnOptions[mlsnIndex].value.msn,
          mlsnOptions[mlsnIndex].value.mlsn,
          searchQueue
        );
      }
    }
  };

  const handleMlsnQueue = (index: number, checked: boolean) => {
    displayQueueList[index].checked = checked;
    setDisplayQueueList([...displayQueueList]);
  };

  const handleMonitorQueue = (index: number, checked: boolean) => {
    monitorQueueList[index].checked = checked;
    setMonitorQueueList([...monitorQueueList]);
  };

  const handleAddMonitor = () => {
    const checkedList: any[] = [];
    let remain = 5 - monitorQueueList.length;
    if (remain > 0) {
      displayQueueList.forEach(item => {
        if (item.checked && remain > 0) {
          item.checked = false;
          checkedList.push(item);
          remain--;
        }
      });
      if (checkedList.length > 0) {
        mlsnAllQueueList.forEach(item => {
          if (checkedList.find(elem => elem.queue === item.queue)) {
            item.pos = 'right';
          }
        });
        setDisplayQueueList(
          mlsnAllQueueList.filter(item => item.pos === 'left')
        );
        setMonitorQueueList(
          mlsnAllQueueList.filter(item => item.pos === 'right')
        );
      }
    }
  };

  const handleDeleteMonitor = () => {
    const checkedList: any[] = [];
    monitorQueueList.forEach(item => {
      if (item.checked) {
        item.checked = false;
        checkedList.push(item);
      }
    });
    if (checkedList.length > 0) {
      mlsnAllQueueList.forEach(item => {
        if (checkedList.find(elem => elem.queue === item.queue)) {
          item.pos = 'left';
        }
      });
      setDisplayQueueList(mlsnAllQueueList.filter(item => item.pos === 'left'));
      setMonitorQueueList(
        mlsnAllQueueList.filter(item => item.pos === 'right')
      );
    }
  };

  const mlsnQueueTableOption = {
    headerVisible: true,
    height: 216,
    minHeight: 216,
    rowHeight: 36,
    enablePlaceholder: false,
    alignColumns: ['cell-content-left', 'cell-content-left'],
    columns: [
      {
        accessorKey: 'checked',
        header: 'Select',
        size: 80,
        minSize: 80,
        maxSize: 80,
        cell: (info: any) => (
          <input
            type="checkbox"
            checked={info.getValue() as boolean}
            onChange={e => handleMlsnQueue(info.row.id, e.target.checked)}
            className="form-check-input"
          />
        ),
        enableSorting: false
      },
      {
        accessorKey: 'queue',
        header: 'Queue name',
        grow: 1,
        enableSorting: false
      }
    ]
  };

  const monitorQueueTableOption = {
    headerVisible: true,
    height: 216,
    minHeight: 216,
    rowHeight: 36,
    enablePlaceholder: false,
    alignColumns: ['cell-content-left', 'cell-content-left'],
    columns: [
      {
        accessorKey: 'checked',
        header: 'Select',
        size: 80,
        minSize: 80,
        maxSize: 80,
        cell: (info: any) => (
          <input
            type="checkbox"
            checked={info.getValue() as boolean}
            onChange={e => handleMonitorQueue(info.row.id, e.target.checked)}
            className="form-check-input"
          />
        ),
        enableSorting: false
      },
      {
        accessorKey: 'queue',
        header: 'Queue name',
        grow: 1,
        enableSorting: false
      }
    ]
  };

  const handleApply = () => {
    dispatch(controlManualModal(false));
    if (monitorQueueList.length !== 0) {
      const manualQueueList = monitoringQueueData.manualQueueList.map(item => {
        return { ...item, enabled: false };
      });
      const queueList = monitorQueueList.map(item => item.queue);
      const manualQueue = {
        enabled: true,
        msn: mlsnOptions[mlsnIndex].value.msn,
        mlsn: mlsnOptions[mlsnIndex].value.mlsn,
        queues: queueList
      };
      const dataIndex = manualQueueList.findIndex(
        item =>
          item.msn === mlsnOptions[mlsnIndex].value.msn &&
          item.mlsn === mlsnOptions[mlsnIndex].value.mlsn
      );
      if (dataIndex >= 0) {
        dispatch(
          updateManualQueueList([
            ...manualQueueList.splice(dataIndex, 1),
            manualQueue
          ])
        );
      } else {
        dispatch(updateManualQueueList([manualQueue]));
      }
    }
  };

  const handleClose = () => {
    dispatch(controlManualModal(false));
  };

  return (
    <React.Fragment>
      <div className="modal_ly_bg"></div>
      <div className="modal_wrap">
        <div className="modal_wrapbox">
          <div className="modal-content sol_w800">
            <div className="modal-header">
              <h5 className="modal-title d-flex">
                <label
                  className="col-form-label sol_mr_10"
                  htmlFor="sele_messagevpn">
                  {RES_HEADER_LABEL_VPN}
                </label>
                <select
                  className="form-select sol_w300 sol_mr_20"
                  id="sele_messagevpn"
                  value={mlsnIndex}
                  onChange={(selected: any) => {
                    if (parseInt(selected.target.value) > 0)
                      handleMlsnIndex(parseInt(selected.target.value));
                  }}>
                  {mlsnOptions.map((item: any, index) => (
                    <option
                      className="mon-default-backcolor"
                      value={index}
                      key={item.label}
                      disabled={index === 0 ? true : false}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </h5>
              <button
                type="button"
                className="btn-close position-absolute sol_btn_rig15"
                aria-label="Close"
                onClick={handleClose}></button>
            </div>

            <div className="modal-body">
              <div className="sol_cont_search no-gutters gap-2 sol_bottom_line">
                <input
                  type="text"
                  className="form-control sol_input_search sol_w315"
                  disabled={mlsnIndex === 0}
                  onChange={e => setSearchQueue(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>

              <div className="col d-flex mt-3">
                <div className="col-md-5">
                  <div className="sol_h25"></div>
                  <div className="sol_box_p0">
                    {/* <DashReactTable
                      containerName="mon-table-container"
                      tableData={displayQueueList}
                      tableOption={mlsnQueueTableOption}
                    /> */}
                  </div>
                  <div className="mt-2">
                    <span>{RES_QUEUE_MODAL_DISPLAY_LIST_HINT}</span>
                  </div>
                </div>

                <div className="col-md-2 d-flex position-relative">
                  <div className="position-fixed sol_colmid_button">
                    <p>
                      <button
                        type="button"
                        className="btn hstack btn-icon btn-outline-light"
                        onClick={handleAddMonitor}>
                        <i className="sol_i_left"></i>
                      </button>
                    </p>
                    <p>
                      <button
                        type="button"
                        className="btn hstack btn-icon btn-outline-light"
                        onClick={handleDeleteMonitor}>
                        <i className="sol_i_right"></i>
                      </button>
                    </p>
                  </div>
                </div>

                <div className="col-md-5">
                  <div className="sol_h25">
                    <h5>{RES_QUEUE_MODAL_MONITOR_LIST_TITLE}</h5>
                  </div>
                  <div className="sol_box_p0">
                    {/* <DashReactTable
                      containerName="mon-table-container"
                      tableData={monitorQueueList}
                      tableOption={monitorQueueTableOption}
                    /> */}
                  </div>
                  <div className="mt-2">
                    <span>{RES_QUEUE_MODAL_MONITOR_LIST_HINT}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer justify-content-center">
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-outline-info btn-md"
                  onClick={handleApply}>
                  {RES_QUEUE_MODAL_APPLY}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light btn-md"
                  onClick={handleClose}>
                  {RES_QUEUE_MODAL_CANCEL}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ModalQueue;

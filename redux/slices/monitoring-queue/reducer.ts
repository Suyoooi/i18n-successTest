import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CHART_DATA_MODE_COUNT, CHART_TIME_RANGE_ABSOLUTE, CHART_TIME_RANGE_RELATIVE, dataSourceType, timeRangeOptions } from "@/data/monitor/chartConstants";
import { PENDING_CNT, PENDING_SIZE, IN_BYTE_RATE, IN_MSG_RATE, OUT_BYTE_RATE, OUT_MSG_RATE } from "@/data/monitor/chartConstants";
import { reqQueueListType, reqQueueType, resPendType, resTpsType } from "./queueSaga";

export type MonitorQueueState = {
  timeRange: any;
  queueList: string[]; // header 에서 설정하는 queue 목록으로 api 호출시 사용
  manualQueueModalOpen: boolean;
  manualQueueList: any[];
  pendingData : resPendType;
  pendingValueMode: string;
  reloadPending: boolean;
  tpsData: resTpsType;
  tpsInValueMode: string;
  tpsOutValueMode: string;
  reloadTps: boolean;
  error: any;
};

export const initialState : MonitorQueueState = {
  timeRange: {
    mode: CHART_TIME_RANGE_RELATIVE, //absolute, relative
    absolute: null,
    relative: 0
  },
  queueList: [],
  manualQueueModalOpen: false,
  manualQueueList: [],
  pendingData : {
    queueNames: [],
    minLabel: 0,
    lastLabel: 0,
    dataFirstLabel: Number.MAX_VALUE,
    dataLastLabel: 0,
    datas: [],
  },
  pendingValueMode: PENDING_CNT,
  reloadPending: false,
  tpsData : {
    queueNames: [],
    minLabel: 0,
    lastLabel: 0,
    dataFirstLabel: Number.MAX_VALUE,
    dataLastLabel: 0,
    tpsInDatas: [],
    tpsOutDatas: [],
  },
  tpsInValueMode: IN_MSG_RATE,
  tpsOutValueMode: OUT_MSG_RATE,
  reloadTps:false,
  error: {}
};

const MonitoringQueueSlice = createSlice({
  name: 'monitoring-queue',
  initialState,
  reducers: {
    reset: () => initialState,
    updateValueMode: (state:MonitorQueueState, action: PayloadAction<any>) => {
      if(action.payload.dataSourceType === dataSourceType.PENDING)  {
        if(action.payload.valueMode === CHART_DATA_MODE_COUNT) {
          state.pendingValueMode = PENDING_CNT;
        }else{
          state.pendingValueMode = PENDING_SIZE;
        }
        state.pendingData = {
          queueNames: [],
          minLabel: 0,
          lastLabel: 0,
          dataFirstLabel: Number.MAX_VALUE,
          dataLastLabel: 0,
          datas: [],
        }
      }else{
        if(action.payload.valueMode === CHART_DATA_MODE_COUNT) {
          state.tpsInValueMode = IN_MSG_RATE;
          state.tpsOutValueMode = OUT_MSG_RATE;
        }else{
          state.tpsInValueMode = IN_BYTE_RATE;
          state.tpsOutValueMode = OUT_BYTE_RATE;
        }
        state.tpsData = {
          queueNames: [],
          minLabel: 0,
          lastLabel: 0,
          dataFirstLabel: Number.MAX_VALUE,
          dataLastLabel: 0,
          tpsInDatas: [],
          tpsOutDatas: [],
        }
      }
    },
    updateReloadFlag: (state: MonitorQueueState, action: PayloadAction<any>) => {
      if(action.payload.dataSourceType === dataSourceType.PENDING) {
        state.reloadPending = action.payload.reloadFlag;
      }else if(action.payload.dataSourceType === dataSourceType.THROUGHPUT) {
        state.reloadTps = action.payload.reloadFlag;
      }
    },
    updateTimeRange: (state: MonitorQueueState, action: PayloadAction<any>) => {
      state.timeRange = action.payload;
    },
    clearData: (state : MonitorQueueState) => { 
      state.pendingData = {
        queueNames: [],
        minLabel: 0,
        lastLabel: 0,
        dataFirstLabel: Number.MAX_VALUE,
        dataLastLabel: 0,
        datas: [],
      };
      state.tpsData = {
        queueNames: [],
        minLabel: 0,
        lastLabel: 0,
        dataFirstLabel: Number.MAX_VALUE,
        dataLastLabel: 0,
        tpsInDatas: [],
        tpsOutDatas: [],
      }
    },
    clearManualQueue: (state: MonitorQueueState) => {
      state.manualQueueList = [];
    },
    updateQueueList: (state : MonitorQueueState, action: PayloadAction<string[]>) => {
      state.queueList = action.payload;
    },
    controlManualModal: (state: MonitorQueueState, action: PayloadAction<boolean>) => {
      state.manualQueueModalOpen = action.payload;
    },
    updateManualQueueList: (state : MonitorQueueState, action: PayloadAction<any>) => {
      state.manualQueueList = action.payload;
    },
    loadQueueList: (state: MonitorQueueState, action: PayloadAction<reqQueueListType>) => { },
    loadQueueListSuccess: (state: MonitorQueueState, action: PayloadAction<any>) => {
      const resData = action.payload.data ?? null;
      if(resData) {
        state.queueList = resData.queueList;
      }
    },
    loadQueueListFail: (state: MonitorQueueState, action:PayloadAction<any>) => {
      state.error = action.payload;
    },
    loadQueueData: (state: MonitorQueueState, action: PayloadAction<reqQueueType>) => {
      // no action
    },
    loadQueueDataSuccess: (state: MonitorQueueState, action: PayloadAction<resPendType|null>) => {
        if(action.payload) state.pendingData = action.payload;
    },
    loadQueueDataFail: (state: MonitorQueueState, action:PayloadAction<any>) => {
      state.error = action.payload;
    },

    loadTpsData: (state: MonitorQueueState, action: PayloadAction<reqQueueType>) => { },
    loadTpsDataSuccess: (state: MonitorQueueState, action: PayloadAction<resTpsType|null>) => {
      if(action.payload) state.tpsData = action.payload;
    },
    loadTpsDataFail: (state: MonitorQueueState, action:PayloadAction<any>) => {
      state.error = action.payload;
    },

  },
});


export const {
  reset,
  updateTimeRange,
  updateValueMode,
  updateReloadFlag,
  updateQueueList,
  controlManualModal,
  updateManualQueueList,
  clearData,
  clearManualQueue,
  loadQueueList,
  loadQueueListSuccess,
  loadQueueListFail,
  loadQueueData,
  loadQueueDataFail,
  loadQueueDataSuccess,
  loadTpsData,
  loadTpsDataFail,
  loadTpsDataSuccess
} = MonitoringQueueSlice.actions;

export const MonitoringQueueReducer = MonitoringQueueSlice.reducer;

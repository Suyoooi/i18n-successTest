import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CHART_TIME_RANGE_RELATIVE  } from "@/data/monitor/chartConstants";
import { resSystemDataType } from "./systemSaga";

export type MonitorSystemState = {
    systemStatus: {
      time: number,
      cpuStatus: number,
      memoryStatus: number,
      diskStatus: number,
      coreCount: number;
      memorySize: number;
    },
    timeRange: any;
    systemData : resSystemDataType;
    error: any;
};

export const initialState : MonitorSystemState = {
    systemStatus: {
      time: 0,
      cpuStatus: 0,
      memoryStatus: 0,
      diskStatus: 0,
      coreCount: 0,
      memorySize: 0,
    },
    timeRange: {
      mode: CHART_TIME_RANGE_RELATIVE, //absolute, relative
      absolute: null,
      relative: 0
    },
    systemData: {
      minLabel: 0,
      lastLabel: 0,
      dataFirstLabel: Number.MAX_VALUE,
      dataLastLabel: 0,
      coreCount: 0,
      memorySize: 0,
      cpuDatas: [],
      memDatas: [],
      diskIODatas: [],
      networkIODatas: [],
    },
    error: {}
};


const MonitoringSystemSlice = createSlice({
  name: 'monitoring-system',
  initialState,
  reducers: {
    reset: () => initialState,
    updateTimeRange: (state: MonitorSystemState, action: PayloadAction<any>) => {
      state.timeRange = action.payload; 
    },
    clearData: (state: MonitorSystemState) => {
      state.systemData = {
        minLabel: 0,
        lastLabel: 0,
        dataFirstLabel: Number.MAX_VALUE,
        dataLastLabel: 0,
        coreCount: 0,
        memorySize: 0,
        cpuDatas: [],
        memDatas: [],
        diskIODatas: [],
        networkIODatas: [],
      }
    },
    loadSystemData: (state: MonitorSystemState, action: PayloadAction<any>) => {
    },
    loadSystemDataSuccess : (state: MonitorSystemState, action: PayloadAction<resSystemDataType|null>) => {
      if(action.payload) state.systemData = action.payload;
    },
    loadSystemDataFail: (state: MonitorSystemState, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    loadSystemStatus: (state: MonitorSystemState, action: PayloadAction<any>) => { },
    loadSystemStatusSuccess : (state: MonitorSystemState, action: PayloadAction<any>) => {
      const resData = action.payload.data ?? null;
      if (resData) {
        state.systemStatus = resData;
      }
    },
    loadSystemStatusFail: (state: MonitorSystemState, action: PayloadAction<any>) => {
      state.error = action.payload;
    }
  },
});

export const {
  reset,
  updateTimeRange,
  clearData,
  loadSystemData,
  loadSystemDataSuccess,
  loadSystemDataFail,
  loadSystemStatus,
  loadSystemStatusSuccess,
  loadSystemStatusFail
} = MonitoringSystemSlice.actions;

export const MonitoringSystemReducer= MonitoringSystemSlice.reducer;
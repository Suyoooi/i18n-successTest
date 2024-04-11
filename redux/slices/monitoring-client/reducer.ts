import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CHART_TIME_RANGE_ABSOLUTE, CHART_TIME_RANGE_RELATIVE } from "@/data/monitor/chartConstants";
import { resClientType } from "./clientSata";

export type MonitorClientState = {
    timeRange: any;
    clientData: resClientType;
    error: any,
};

const initialState: MonitorClientState = {
  timeRange: {
    mode: CHART_TIME_RANGE_RELATIVE, //absolute, relative
    absolute: null,
    relative: 0
  },
  clientData: {
    minLabel: 0,
    lastLabel: 0,
    dataFirstLabel: Number.MAX_VALUE,
    dataLastLabel: 0,
    clientNames: [],
    datas: []
  },
  error: {},
};

const MonitoringClientSlice = createSlice({
    name: 'monitoring-client',
    initialState,
    reducers: {
        reset: () => initialState,
        updateTimeRange: (state: MonitorClientState, action: PayloadAction<any>) => {
          state.timeRange = action.payload;
        },
        clearData: (state : MonitorClientState) => {
          if(state.clientData.minLabel !== 0 || state.clientData.lastLabel !== 0) {
            state.clientData = {
              minLabel: 0,
              lastLabel: 0,
              dataFirstLabel: Number.MAX_VALUE,
              dataLastLabel: 0,
              clientNames: [],
              datas: []
            };
          }
        },
        loadClientData: (state: MonitorClientState, action: PayloadAction<any>) => {},
        loadClientDataSuccess: (state: MonitorClientState, action: PayloadAction<resClientType|null>) => {
            const resData = action.payload;
            if (resData) {
              state.clientData = resData;
            }
        },
        loadClientDataFail: (state: MonitorClientState, action:PayloadAction<any>) => {
            state.error = action.payload;
        }
    },
});

export const {
  reset,
  updateTimeRange,
  clearData,
  loadClientData,
  loadClientDataSuccess,
  loadClientDataFail
} = MonitoringClientSlice.actions;

export const MonitoringClientReducer =  MonitoringClientSlice.reducer;
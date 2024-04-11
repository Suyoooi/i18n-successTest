import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { resDashAlertType } from "./dashSaga";

export type DashboardState = {
    /* {
        msn: string,
        active: string,  //alive or dead
        standby: string,
    }
        */
    msnPeriod: number;
    msnLastLabel: number;
    msnStatus : any [];
    /* {
        msn: string,
        mlsn: string,
        queue: string,
        count: number,
        avgCount: number,
    } */
    pendingPeriod: number;
    pendingLastLabel: number;
    pendingData: any [];

    /* . {
        msn: string,
        mlsn: string,
        queue: string,
        inCount: number,
        outCount: number,
        avgRate: number,
    }
    */
    tpsPeriod: number;
    tpsLastLabel: number;
    highTPSData: any [];
    lowTPSData: any [];
    /*
    {
            id: number,
            label: number,
            title: string,
            content: string
    }
    */
    alertPeriod: number;
    alertTickValue: number;

    alertData: resDashAlertType;
    error: any;
};

const initialState : DashboardState = {
    msnPeriod: 1000*60*10,
    msnLastLabel: 0,
    msnStatus: [],
    pendingPeriod: 1000*60*10,
    pendingLastLabel: 0,
    pendingData: [],
    tpsPeriod: 1000*60*10,
    tpsLastLabel: 0,
    highTPSData: [],
    lowTPSData: [],
    alertPeriod: 1000*60*60*3,
    alertTickValue: 1000*60*10,
    alertData: {
      lastLabel: 0,
      dataFirstLabel: Number.MAX_VALUE,
      dataLastLabel: 0,
      anomaly: [],
      failure: [],
      exception: []
    },
    error: null
};

const DashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    reset: () => initialState,
    loadMsnStatus: (state: DashboardState) => {},
    loadMsnStatusSuccess: (state: DashboardState, action: PayloadAction<any>) => {
      state.msnStatus = action.payload?.data ?? [];
    },
    loadMsnStatusFail: (state: DashboardState, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    loadPendingData: (state: DashboardState) => {},
    loadPendingDataSuccess: (state: DashboardState, action: PayloadAction<any>) => {
      state.pendingData = action.payload?.data ?? [];
    },
    loadPendingDataFail: (state: DashboardState, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    loadHighTPSData: (state: DashboardState) => {},
    loadHighTPSDataSuccess: (state: DashboardState, action: PayloadAction<any>) => {
      state.highTPSData= action.payload?.data ?? [];
    },
    loadHighTPSDataFail: (state: DashboardState, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    loadLowTPSData: (state: DashboardState) => {},
    loadLowTPSDataSuccess: (state: DashboardState, action: PayloadAction<any>) => {
      state.lowTPSData= action.payload?.data ?? [];
    },
    loadLowTPSDataFail: (state: DashboardState, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    loadAlertData: (state: DashboardState, action: PayloadAction<any>) => {},
    loadAlertDataSuccess: (state: DashboardState, action: PayloadAction<resDashAlertType|null>) => {
      if(action.payload) {
        state.alertData = action.payload;
      }
    },
    loadAlertDataFail: (state: DashboardState, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
  },
});

export const {
  reset,
  loadMsnStatus,
  loadMsnStatusSuccess,
  loadMsnStatusFail,
  loadPendingData,
  loadPendingDataSuccess,
  loadPendingDataFail,
  loadHighTPSData,
  loadHighTPSDataSuccess,
  loadHighTPSDataFail,
  loadLowTPSData,
  loadLowTPSDataSuccess,
  loadLowTPSDataFail,
  loadAlertData,
  loadAlertDataSuccess,
  loadAlertDataFail
} = DashboardSlice.actions;

export const DashboardReducer =  DashboardSlice.reducer;
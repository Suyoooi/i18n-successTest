import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CHART_REFRESH_MODE_REALTIME, CHART_TIME_RANGE_ABSOLUTE, CHART_TIME_RANGE_RELATIVE, ENABLE_MARKAREA } from "@/data/monitor/chartConstants";

type MarkAreaType = {
  startMarkLine : number|null;
  endMarkLine : number|null;
}

export type MonitorState = {
  nodeInfo: {
    retryMode: boolean;
    nodeList : any[];
    error: any;
  };
  curNode: any;
  maxLabels: number;
  refreshMode: string;
  timeRange: any;
  markArea: MarkAreaType | null;
  error: any;
};

const initialState : MonitorState = {
  nodeInfo:{
    retryMode: true,
    nodeList: [],
    error: null,
  },
  curNode: null,
  maxLabels : 20,
  refreshMode: CHART_REFRESH_MODE_REALTIME,
  timeRange: { 
        mode: CHART_TIME_RANGE_RELATIVE, //absolute, relative
        absolute: null,
        relative: 0
  },
  markArea: null,
  error: null
};

const MonitoringSlice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {
    reset: () => initialState,
    updateRefreshMode: (state: MonitorState, action: PayloadAction<string>) => {
      state.refreshMode = action.payload;
    },
    updateTimeRange: (state: MonitorState, action: PayloadAction<any>) => {
      state.timeRange = action.payload;
    },
    updateNode: (state: MonitorState, action: PayloadAction<any>) => {
      state.curNode = action.payload;
    },
    addMarkLine: (state: MonitorState, action: PayloadAction<number>) => {
      if(!ENABLE_MARKAREA) return;
      if(!state.markArea) {
        state.markArea = {startMarkLine: action.payload, endMarkLine: null};
      }else if(state.markArea) {
        if(!state.markArea.startMarkLine) {
          state.markArea.startMarkLine = action.payload;
        }else if(!state.markArea.endMarkLine) {
          state.markArea.endMarkLine = action.payload;
        }
      }
    },
    deleteMarkLine: (state: MonitorState, action: PayloadAction<number>) => {
      if(!ENABLE_MARKAREA) return;
      if(!state.markArea) return;
      if(state.markArea.startMarkLine === action.payload) state.markArea.startMarkLine = null;
      else if(state.markArea.endMarkLine === action.payload) state.markArea.endMarkLine = null;
    },
    clearMarkArea: (state: MonitorState) => {
      state.markArea = null;
    },
    loadAllNodes: (state: MonitorState, action: PayloadAction<any>) => { },
    loadAllNodesSuccess: (state: MonitorState, action: PayloadAction<any>) => {
      state.nodeInfo = {...state.nodeInfo, nodeList: action.payload.data ?? [], error: null };
    },
    loadAllNodesFail: (state: MonitorState, action: PayloadAction<any>) => {
      state.nodeInfo = {...state.nodeInfo, error: action.payload};
    }
  },
});

export const {
  reset,
  updateRefreshMode,
  updateTimeRange,
  updateNode,
  addMarkLine,
  deleteMarkLine,
  clearMarkArea,
  loadAllNodes,
  loadAllNodesSuccess,
  loadAllNodesFail
} = MonitoringSlice.actions;

export const MonitoringReducer =  MonitoringSlice.reducer;
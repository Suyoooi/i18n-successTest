import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CHART_TIME_RANGE_ABSOLUTE, CHART_TIME_RANGE_RELATIVE, ENABLE_MARKAREA } from "@/data/monitor/chartConstants";

type historyType = {
  startDateTime: number,
  endDateTime: number
}
export type MonitorPersistState = {
  timeRangeHistory: historyType[];
};

const initialState : MonitorPersistState = {
  timeRangeHistory: [],
};

const MonitoringPersistSlice = createSlice({
  name: 'monitoring-persist',
  initialState,
  reducers: {
    reset: () => initialState,
    addTimeRangeHistory: (state: MonitorPersistState, action: PayloadAction<historyType>) => {
      const fIndex = state.timeRangeHistory.findIndex((item: any) => (item.startDateTime === action.payload.startDateTime && item.endDateTime === action.payload.endDateTime));
      if (fIndex < 0) {
        // max 5개로 제한한다.
        const count = state.timeRangeHistory.length;
        const data = { startDateTime: action.payload.startDateTime, endDateTime: action.payload.endDateTime };
        if(count === 0) {
          state.timeRangeHistory = [data];
        }else if(count >= 5) {
          state.timeRangeHistory = [data, ...state.timeRangeHistory.slice(0, 4)];
        }else{
          state.timeRangeHistory = [data, ...state.timeRangeHistory];
        }
      }
    },
    deleteTimeRangeHistory: (state: MonitorPersistState, action: PayloadAction<historyType>) => {
      const fIndex = state.timeRangeHistory.findIndex((item: any) => (item.startDateTime === action.payload.startDateTime && item.endDateTime === action.payload.endDateTime));
      if (fIndex >= 0) {
        state.timeRangeHistory.splice(fIndex, 1);
      }
    },
    cleanupHistory: (state: MonitorPersistState, action: PayloadAction<number>) => {
      const dateTime = action.payload;
      state.timeRangeHistory = state.timeRangeHistory.filter(item => item.startDateTime >= dateTime);
    }
  },
});

export const {
  reset,
  addTimeRangeHistory,
  deleteTimeRangeHistory,
  cleanupHistory
} = MonitoringPersistSlice.actions;

export const MonitoringPersistReducer =  MonitoringPersistSlice.reducer;
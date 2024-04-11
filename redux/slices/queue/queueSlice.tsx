"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IData {
  queueName: string;
}

interface VpnState {
  selectedQueue: IData | null;
}

const initialState: VpnState = {
  selectedQueue: null,
};

const QueueSlice = createSlice({
  name: "queue",
  initialState,
  reducers: {
    setSelectedQueue: (state, action: PayloadAction<IData | null>) => {
      state.selectedQueue = action.payload;
    },
  },
});

export const { setSelectedQueue } = QueueSlice.actions;

export default QueueSlice.reducer;

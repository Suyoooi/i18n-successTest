"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IData {
  msgVpnName: string;
  msnId: string;
  mlsnSn?: number;
}

interface VpnState {
  vpnInfo: IData | null;
}

const initialState: VpnState = {
  vpnInfo: null,
};

const monitorVpnSlice = createSlice({
  name: "vpn",
  initialState,
  reducers: {
    setVpnInfo: (state, action: PayloadAction<IData | null>) => {
      state.vpnInfo = action.payload;
    },
  },
});

export const { setVpnInfo } = monitorVpnSlice.actions;

export default monitorVpnSlice.reducer;

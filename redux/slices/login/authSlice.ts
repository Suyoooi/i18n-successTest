"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthData {
  id: string;
}

interface AuthState {
  userId: AuthData | null;
}

const initialState: AuthState = {
  userId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<AuthData | null>) => {
      state.userId = action.payload;
    },
  },
});

export const { setUserId } = authSlice.actions;

export default authSlice.reducer;

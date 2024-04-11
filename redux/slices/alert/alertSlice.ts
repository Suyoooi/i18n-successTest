import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AlertState {
  isOpen: boolean;
}

const initialState: AlertState = {
  isOpen: false,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    openAlert: (state) => {
      state.isOpen = true;
    },
    closeAlert: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openAlert, closeAlert } = alertSlice.actions;
export default alertSlice.reducer;

// ** 사용 방법 **

// const dispatch = useAppDispatch();

// == close alert ==
// dispatch(closeAlert());

// == open alert ==
// dispatch(openeAlert());

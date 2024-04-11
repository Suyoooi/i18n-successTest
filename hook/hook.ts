import { AppDispatch, RootState } from "@/redux/store";
import { EnhancedStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { Persistor } from "redux-persist";

// AppStore 타입을 업데이트합니다.
export type AppStore = {
  store: EnhancedStore;
  persistor: Persistor;
};

export const useAppStore: () => AppStore["store"] = useStore;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { takeLatest, put, call, all, fork, select } from "redux-saga/effects";
import {
  loadClientData,
  loadClientDataFail,
  loadClientDataSuccess,
} from "./reducer";
import { AxiosResponse } from "axios";
import { PayloadAction } from "@reduxjs/toolkit";
import { getClientInfo } from "@/app/[locale]/(monitor)/monitor/helpers/api_helper";
import { ClientDataWork } from "./clientWorker";
import { RootState } from "@/redux/store";

export interface reqClientType {
  sTime: number;
  eTime: number;
  msn: string;
  mlsn: string;
  categoryType: string[];
}

export interface resClientType {
  minLabel: number;
  dataFirstLabel: number;
  dataLastLabel: number;
  lastLabel: number;
  clientNames: string[];
  datas: number[][][];
}

function callClientWork(
  reqParams: reqClientType,
  refreshMode: string,
  state: any,
  data: any
) {
  return new Promise((resolve, reject) => {
    return resolve(ClientDataWork(reqParams, refreshMode, state, data));
  });
}

function* loadClientDataApi(action: PayloadAction<reqClientType>) {
  try {
    const response: AxiosResponse<any> = yield call(
      getClientInfo,
      action.payload
    );
    const serverResponse = response.data ? response.data : response;
    if (serverResponse.responseCode < 400) {
      const state: RootState = yield select();
      const resData: resClientType | null = yield call(
        callClientWork,
        action.payload,
        state.monitorHeader.refreshMode,
        state.monitorClient,
        serverResponse.data
      );
      yield put(loadClientDataSuccess(resData));
    } else {
      yield put(
        loadClientDataFail({
          error: "error response:" + serverResponse.responseCode,
        })
      );
    }
  } catch (error: any) {
    const message =
      error?.name === "AxiosError" ? error.message : "server error!";
    yield put(loadClientDataFail({ error: message }));
  }
}

function* watchLoadClientData() {
  yield takeLatest(loadClientData, loadClientDataApi);
}

export default function* clientSaga() {
  yield all([fork(watchLoadClientData)]);
}

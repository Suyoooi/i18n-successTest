import { takeLatest, put, call, all, fork, select } from "redux-saga/effects";
import {
  loadQueueData,
  loadQueueDataFail,
  loadQueueDataSuccess,
  loadQueueList,
  loadQueueListFail,
  loadQueueListSuccess,
  loadTpsData,
  loadTpsDataFail,
  loadTpsDataSuccess,
} from "./reducer";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  getMonitoringQueueData,
  getQueueList,
} from "@/app/[locale]/(monitor)/monitor/helpers/api_helper";
import { RootState } from "@/redux/store";
import { PendWork } from "./pendWorker";
import { TpsWork } from "./tpsWorker";

export interface reqQueueListType {
  msn: string;
  mlsn: string;
  queueType: string;
  direction: string;
  count: number;
}

export interface reqQueueType {
  msn: string;
  mlsn: string;
  sTime: number;
  eTime: number;
  queues: string[];
  chartList: string[];
  // pending: { queue: string[], mode: string },
  // tps: { queue: string[], mode: string }
}

export interface resPendType {
  queueNames: string[];
  minLabel: number;
  lastLabel: number;
  dataFirstLabel: number;
  dataLastLabel: number;
  datas: number[][][];
}
export interface resTpsType {
  queueNames: string[];
  minLabel: number;
  lastLabel: number;
  dataFirstLabel: number;
  dataLastLabel: number;
  tpsInDatas: number[][][];
  tpsOutDatas: number[][][];
}

function* loadQueueListApi(action: PayloadAction<reqQueueListType>) {
  try {
    const response: AxiosResponse<any> = yield call(
      getQueueList,
      action.payload
    );
    const serverResponse = response.data ? response.data : response;
    if (serverResponse.responseCode < 400) {
      yield put(loadQueueListSuccess(serverResponse));
    } else {
      yield put(
        loadQueueListFail({
          error: "error response:" + serverResponse.responseCode,
        })
      );
    }
  } catch (error: any) {
    const message =
      error?.name === "AxiosError" ? error.message : "server error!";
    yield put(loadQueueListFail({ error: message }));
  }
}

function callQueueWork(
  reqParams: reqQueueType,
  refreshMode: string,
  state: any,
  data: any
) {
  return new Promise((resolve, reject) => {
    return resolve(PendWork(reqParams, refreshMode, state, data));
  });
}
function callTpsWork(
  reqParams: reqQueueType,
  refreshMode: string,
  state: any,
  data: any
) {
  return new Promise((resolve, reject) => {
    return resolve(TpsWork(reqParams, refreshMode, state, data));
  });
}

function* loadQueueDataApi(action: PayloadAction<reqQueueType>) {
  try {
    const response: AxiosResponse<any> = yield call(
      getMonitoringQueueData,
      action.payload
    );
    const serverResponse = response.data ? response.data : response;
    if (serverResponse.responseCode < 400) {
      const state: RootState = yield select();
      const resData: resPendType | null = yield call(
        callQueueWork,
        action.payload,
        state.monitorHeader.refreshMode,
        state.monitorQueue,
        serverResponse.data
      );
      yield put(loadQueueDataSuccess(resData));
    } else {
      yield put(
        loadQueueDataFail({
          error: "error response:" + serverResponse.responseCode,
        })
      );
    }
  } catch (error: any) {
    const message =
      error?.name === "AxiosError" ? error.message : "server error!";
    yield put(loadQueueDataFail({ error: message }));
  }
}

function* loadTpsDataApi(action: PayloadAction<reqQueueType>) {
  try {
    const response: AxiosResponse<any> = yield call(
      getMonitoringQueueData,
      action.payload
    );
    const serverResponse = response.data ? response.data : response;
    if (serverResponse.responseCode < 400) {
      const state: RootState = yield select();
      const resData: resTpsType | null = yield call(
        callTpsWork,
        action.payload,
        state.monitorHeader.refreshMode,
        state.monitorQueue,
        serverResponse.data
      );
      yield put(loadTpsDataSuccess(resData));
    } else {
      yield put(
        loadTpsDataFail({
          error: "error response:" + serverResponse.responseCode,
        })
      );
    }
  } catch (error: any) {
    const message =
      error?.name === "AxiosError" ? error.message : "server error!";
    yield put(loadTpsDataFail({ error: message }));
  }
}

function* watchLoadQueueList() {
  yield takeLatest(loadQueueList, loadQueueListApi);
}

function* watchLoadQueueData() {
  yield takeLatest(loadQueueData, loadQueueDataApi);
}

function* watchLoadTpsData() {
  yield takeLatest(loadTpsData, loadTpsDataApi);
}

export default function* queueSaga() {
  yield all([
    fork(watchLoadQueueList),
    fork(watchLoadQueueData),
    fork(watchLoadTpsData),
  ]);
}

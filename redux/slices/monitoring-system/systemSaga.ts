import { takeLatest, put, call, all, fork, select } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  getMonitoringSystemData,
  getMonitoringSystemStatus,
} from "@/app/[locale]/(monitor)/monitor/helpers/api_helper";
import {
  loadSystemData,
  loadSystemDataFail,
  loadSystemDataSuccess,
  loadSystemStatus,
  loadSystemStatusFail,
  loadSystemStatusSuccess,
} from "./reducer";
import { RootState } from "@/redux/store";
import { SystemDataWork } from "./systemDataWorker";

/*
### systemData req
serverType: "SOL"
sTime: 1234
eTime: 5678
msn: "broker-id"

### systemData res
{ 
  responseCode : 응답 상태 코드 - HTTP 응답 코드 형식
  label: [1234,5678], 
  coreCount: 4, 
  memorySize: 256,
  cpuUsage: [30.45, 40.60], 
  memoryUsed: [70.23, 80.96],
  diskRead: [7070, 7038],     
  diskWrite: [1234,56789],     
  networkRead: [12345, 5678],   
  networkWrite: [123456, 48679] 
}

### systemStatus req 
serverType: "SOL"
msn: "broker-id"
time: 1234

### systemStatus res 
{ 
 responseCode : 응답 상태 코드 - HTTP 응답 코드 형식
 time: 1234,
  cpuStatus: 30.45, 
  memoryStatus: 70.23,
  diskStatus: 20.34,  
  coreCount: 8,                
  memorySize: 256,            
}
*/

export interface reqSystemType {
  sTime: number;
  eTime: number;
  msn: string;
}
export interface reqSystemStatusType {
  msn: string;
  time: number;
}

export interface resSystemDataType {
  minLabel: number;
  lastLabel: number;
  dataFirstLabel: number;
  dataLastLabel: number;
  coreCount: number;
  memorySize: number;
  cpuDatas: number[][][];
  memDatas: number[][][];
  diskIODatas: number[][][];
  networkIODatas: number[][][];
}

function callSystemDataWork(
  reqParams: reqSystemType,
  refreshMode: string,
  state: any,
  data: any
) {
  return new Promise((resolve, reject) => {
    return resolve(SystemDataWork(reqParams, refreshMode, state, data));
  });
}

function* loadSystemDataFromServer(action: PayloadAction<reqSystemType>) {
  try {
    const response: AxiosResponse<any> = yield call(
      getMonitoringSystemData,
      action.payload
    );
    const serverResponse = response.data ? response.data : response;
    if (serverResponse.responseCode < 400) {
      const state: RootState = yield select();
      const resData: resSystemDataType | null = yield call(
        callSystemDataWork,
        action.payload,
        state.monitorHeader.refreshMode,
        state.monitorSystem,
        serverResponse.data
      );
      yield put(loadSystemDataSuccess(resData));
    } else {
      yield put(
        loadSystemDataFail({
          error: "error response:" + serverResponse.responseCode,
        })
      );
    }
  } catch (error: any) {
    const message =
      error?.name === "AxiosError" ? error.message : "server error!";
    yield put(loadSystemDataFail({ error: message }));
  }
}

function* loadSystemStatusFromServer(
  action: PayloadAction<reqSystemStatusType>
) {
  try {
    const response: AxiosResponse<any> = yield call(
      getMonitoringSystemStatus,
      action.payload
    );
    const serverResponse = response.data ? response.data : response;
    if (serverResponse.responseCode < 400) {
      yield put(loadSystemStatusSuccess(serverResponse));
    } else {
      yield put(
        loadSystemStatusFail({
          error: "error response:" + serverResponse.responseCode,
        })
      );
    }
  } catch (error: any) {
    const message =
      error?.name === "AxiosError" ? error.message : "server error!";
    yield put(loadSystemStatusFail({ error: message }));
  }
}

function* watchLoadSystemData() {
  yield takeLatest(loadSystemData, loadSystemDataFromServer);
}

function* watchLoadSystemStatus() {
  yield takeLatest(loadSystemStatus, loadSystemStatusFromServer);
}

export default function* systemSaga() {
  yield all([fork(watchLoadSystemData), fork(watchLoadSystemStatus)]);
}

import { takeLatest, put, call, all, fork, select } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  loadAlertData,
  loadAlertDataFail,
  loadAlertDataSuccess,
  loadHighTPSData,
  loadHighTPSDataFail,
  loadHighTPSDataSuccess,
  loadLowTPSData,
  loadLowTPSDataFail,
  loadLowTPSDataSuccess,
  loadMsnStatus,
  loadMsnStatusFail,
  loadMsnStatusSuccess,
  loadPendingData,
  loadPendingDataFail,
  loadPendingDataSuccess
} from './reducer';
import {
  getDashboardAlertData,
  getDashboardAlertDetail,
  getDashboardMsnStatus,
  getDashboardPendingData,
  getDashboardTPSData
} from '@/app/[locale]/(monitor)/monitor/helpers/api_helper';
import { RootState } from '@/redux/store';
import { DashDataWork } from './dashDataWork';

function* loadMsnStatusApi() {
  try {
    const response: AxiosResponse<any> = yield call(getDashboardMsnStatus);
    const serverResponse = response.data ? response.data : response;
    if (serverResponse.responseCode < 400) {
      yield put(loadMsnStatusSuccess(serverResponse));
    } else {
      yield put(
        loadMsnStatusFail({
          error: 'error response:' + serverResponse.responseCode
        })
      );
    }
  } catch (error: any) {
    const message =
      error?.name === 'AxiosError' ? error.message : 'server error!';
    yield put(loadMsnStatusFail({ error: message }));
  }
}
function* loadPendingDataApi() {
  try {
    const response: AxiosResponse<any> = yield call(getDashboardPendingData);
    const serverResponse = response.data ? response.data : response;
    if (serverResponse.responseCode < 400) {
      yield put(loadPendingDataSuccess(serverResponse));
    } else {
      yield put(
        loadPendingDataFail({
          error: 'error response:' + serverResponse.responseCode
        })
      );
    }
  } catch (error: any) {
    const message =
      error?.name === 'AxiosError' ? error.message : 'server error!';
    yield put(loadPendingDataFail({ error: message }));
  }
}
function* loadHighTPSDataApi() {
  try {
    const response: AxiosResponse<any> = yield call(getDashboardTPSData, {
      type: 'high'
    });
    const serverResponse = response.data ? response.data : response;
    if (serverResponse.responseCode < 400) {
      yield put(loadHighTPSDataSuccess(serverResponse));
    } else {
      yield put(
        loadHighTPSDataFail({
          error: 'error response:' + serverResponse.responseCode
        })
      );
    }
  } catch (error: any) {
    const message =
      error?.name === 'AxiosError' ? error.message : 'server error!';
    yield put(loadHighTPSDataFail({ error: message }));
  }
}
function* loadLowTPSDataApi() {
  try {
    const response: AxiosResponse<any> = yield call(getDashboardTPSData, {
      type: 'low'
    });
    const serverResponse = response.data ? response.data : response;
    if (serverResponse.responseCode < 400) {
      yield put(loadLowTPSDataSuccess(serverResponse));
    } else {
      yield put(
        loadLowTPSDataFail({
          error: 'error response:' + serverResponse.responseCode
        })
      );
    }
  } catch (error: any) {
    const message =
      error?.name === 'AxiosError' ? error.message : 'server error!';
    yield put(loadLowTPSDataFail({ error: message }));
  }
}
export interface reqAlertDataType {
  sTime: number;
  eTime: number;
}

export interface resDashAlertType {
  lastLabel: number;
  dataFirstLabel: number;
  dataLastLabel: number;
  anomaly: any[];
  failure: any[];
  exception: any[];
}

function callDashWork(reqParams: reqAlertDataType, state: any, data: any) {
  return new Promise((resolve, reject) => {
    return resolve(DashDataWork(reqParams, state, data));
  });
}

function* loadAlertDataApi(action: PayloadAction<reqAlertDataType>) {
  try {
    const response: AxiosResponse<any> = yield call(
      getDashboardAlertData,
      action.payload
    );
    const serverResponse = response.data ? response.data : response;
    if (serverResponse.responseCode < 400) {
      const state: RootState = yield select();
      const resData: resDashAlertType | null = yield call(
        callDashWork,
        action.payload,
        state.dashboard,
        serverResponse.data
      );
      yield put(loadAlertDataSuccess(resData));
    } else {
      yield put(
        loadAlertDataFail({
          error: 'error response:' + serverResponse.responseCode
        })
      );
    }
  } catch (error: any) {
    const message =
      error?.name === 'AxiosError' ? error.message : 'server error!';
    yield put(loadAlertDataFail({ error: message }));
  }
}

function* watchLoadMsnStatus() {
  yield takeLatest(loadMsnStatus, loadMsnStatusApi);
}
function* watchLoadPendingData() {
  yield takeLatest(loadPendingData, loadPendingDataApi);
}
function* watchLoadHighTPSData() {
  yield takeLatest(loadHighTPSData, loadHighTPSDataApi);
}
function* watchLoadLowTPSData() {
  yield takeLatest(loadLowTPSData, loadLowTPSDataApi);
}
function* watchLoadAlertData() {
  yield takeLatest(loadAlertData, loadAlertDataApi);
}

export default function* dashSaga() {
  yield all([
    fork(watchLoadMsnStatus),
    fork(watchLoadPendingData),
    fork(watchLoadHighTPSData),
    fork(watchLoadLowTPSData),
    fork(watchLoadAlertData)
  ]);
}

import { takeLatest, put, call, all, fork } from "redux-saga/effects";
import { AxiosResponse } from "axios";
import { PayloadAction } from "@reduxjs/toolkit";
import { getAllNodes } from "@/app/[locale]/(monitor)/monitor/helpers/api_helper";
import { loadAllNodes, loadAllNodesFail, loadAllNodesSuccess } from "./reducer";

interface reqNodeType {
  serverType: string;
}

function* loadAllNodesApi(action: PayloadAction<reqNodeType>) {
  try {
    const response: AxiosResponse<any> = yield call(
      getAllNodes,
      action.payload
    );
    const serverResponse = response.data ? response.data : response;
    if (serverResponse.responseCode < 400) {
      yield put(loadAllNodesSuccess(serverResponse));
    } else {
      yield put(
        loadAllNodesFail({
          error: "error response:" + serverResponse.responseCode,
        })
      );
    }
  } catch (error: any) {
    const message =
      error?.name === "AxiosError" ? error.message : "server error!";
    yield put(loadAllNodesFail({ error: message }));
  }
}

function* watchLoadAllNodes() {
  yield takeLatest(loadAllNodes, loadAllNodesApi);
}

export default function* monitorSaga() {
  yield all([fork(watchLoadAllNodes)]);
}

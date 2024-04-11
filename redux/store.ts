import { configureStore } from "@reduxjs/toolkit";
import vpnReducer from "./slices/vpn/vpnSlice";
import monitorVpnReducer from "./slices/vpn/monitorVpnSlice";
import queueReducer from "./slices/queue/queueSlice";
import authReducer from "./slices/login/authSlice";
import modalReducer from "./slices/modal/modalSlice";
import alertReducer from "./slices/alert/alertSlice";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { MonitoringReducer } from "./slices/monitoring/reducer";
import { MonitoringClientReducer } from "./slices/monitoring-client/reducer";
import { MonitoringQueueReducer } from "./slices/monitoring-queue/reducer";
import { MonitoringSystemReducer } from "./slices/monitoring-system/reducer";
import { DashboardReducer } from "./slices/dashboard/reducer";

import createSagaMiddleare from "redux-saga";
import { all, fork } from "redux-saga/effects";
import queueSaga from "./slices/monitoring-queue/queueSaga";
import clientSaga from "./slices/monitoring-client/clientSata";
import systemSaga from "./slices/monitoring-system/systemSaga";
import monitorSaga from "./slices/monitoring/monitorSaga";
import dashSaga from "./slices/dashboard/dashSaga";
import { MonitoringPersistReducer } from "./slices/monitoring/persistReducer";

// Persist의 설정
const persistConfig = {
  key: "vpn",
  storage,
};

const vpnPersistConfig = {
  key: "vpnInfo",
  storage,
};

const queuePersistConfig = {
  key: "queue",
  storage,
};

const authPersistConfig = {
  key: "auth",
  storage,
};

const monitorPersistConfig = {
  key: 'monitor',
  storage,
}

const persistedReducer = persistReducer(persistConfig, vpnReducer);
const persistedVpnReducer = persistReducer(vpnPersistConfig, monitorVpnReducer);
const queuePersistedReducer = persistReducer(queuePersistConfig, queueReducer);
const authPersistedReducer = persistReducer(authPersistConfig, authReducer);
const monitorPersistedReducer = persistReducer(monitorPersistConfig, MonitoringPersistReducer);

export function* rootSaga() {
  yield all([
    fork(dashSaga),
    fork(monitorSaga),
    fork(queueSaga),
    fork(clientSaga),
    fork(systemSaga),
  ]);
}
const sagaMiddleware = createSagaMiddleare();

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      isVpn: persistedReducer,
      monitorVpn: persistedVpnReducer,
      queue: queuePersistedReducer,
      auth: authPersistedReducer,
      modal: modalReducer,
      alert: alertReducer,
      monitorPersist: monitorPersistedReducer,
      monitorHeader: MonitoringReducer,
      monitorClient: MonitoringClientReducer,
      monitorQueue: MonitoringQueueReducer,
      monitorSystem: MonitoringSystemReducer,
      dashboard: DashboardReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(sagaMiddleware),
    devTools: process.env.NODE_ENV !== "production",
  });
  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);
  return { store, persistor };
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["store"]["getState"]>;
export type AppDispatch = AppStore["store"]["dispatch"];

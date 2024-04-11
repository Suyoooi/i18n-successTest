"use client "

import axios from "axios";
import qs from "qs";
import fakeBackend from "./fakeBackend";
import * as url from "./url_helper";

// const API_URL = 'http://192.168.10.7:50008'
const defaultBackendAxios = axios.create({
    baseURL: '/api/v2',
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
    },
    paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
    },
    timeout: 5000,
});


/* fake backend */
const fakeBackendAxios = axios.create({
    baseURL: "http://192.168.0.1/3000",
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
    },
    paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
    },
    timeout: 5000,
});
fakeBackend(fakeBackendAxios);


const monitorAxios = defaultBackendAxios;
const dashAxios = defaultBackendAxios;
// const monitorAxios = fakeBackendAxios;
// const dashAxios = fakeBackendAxios;

export const getAllNodes = (params: any) => monitorAxios.get(url.GET_ALL_NODES, { params : params });
export const getQueueList = (params: any) => monitorAxios.get(url.GET_QUEUE_LIST, { params: params});
export const getAllQueueList = (params: any) => monitorAxios.get(url.GET_ALL_QUEUE_LIST, { params: params});

export const getMonitoringQueueData = (params: any) => monitorAxios.get(url.GET_MONITORING_QUEUE_DATA, { params: params});
export const getClientInfo = (params: any) => monitorAxios.get(url.GET_MONITORING_CLIENT_INFO, { params: params});
export const getMonitoringSystemData = (params: any) => monitorAxios.get(url.GET_MONITORING_SYSTEM_DATA, { params: params});
export const getMonitoringSystemStatus = (params: any) => monitorAxios.get(url.GET_MONITORING_SYSTEM_STATUS, { params: params});

// dashboard
export const getDashboardMsnStatus = () => dashAxios.get(url.GET_DASHBOARD_MSN_STATUS);
export const getDashboardPendingData = () => dashAxios.get(url.GET_DASHBOARD_PENDING_DATA);
export const getDashboardTPSData = (params: any) => dashAxios.get(url.GET_DASHBOARD_TPS_DATA, { params: params});
export const getDashboardAlertData = (params: any) => dashAxios.get(url.GET_DASHBOARD_ALERT_DATA, { params:params});
export const getDashboardAlertDetail = (params: any) => dashAxios.get(url.GET_DASHBOARD_ALERT_DETAIL, { params: params});

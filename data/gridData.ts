import { GridValueType } from "@/types/grid";
import { ColumnDefinition } from "react-tabulator";

export const columns = [
  { title: "Name", field: "name", width: 300 },
  { title: "Size", field: "size", align: "left", width: 200 },
];
export const topData1: GridValueType[] = [
  { key: "MES01 > edpVPN > Q/RECV>M01", value: "0/121건" },
  { key: "EOPS1 > edpVPN > Q/RECV>M99", value: "0/1,123건" },
  { key: "EDP01 > edpVPN > Q/RECV>F01", value: "16/233건" },
  { key: "MES02 > edpVPN > Q/RECV>E01", value: "111/326건" },
  { key: "MES03 > edpVPN > Q/RECV>M99", value: "181/326건" },
];

export const topColumns: ColumnDefinition[] = [
  { title: "key", field: "key", width: 300 },
  { title: "value", field: "value", width: 120, hozAlign: "right" },
];

export const statusData = [
  { status: [true, false], value: "MES01" },
  { status: true, value: "EOPS1" },
  { status: [null, null], value: "EDP01" },
  { status: [true, false], value: "MES02" },
  { status: null, value: "MES03" },
];

export const vpnColumn: ColumnDefinition[] = [
  {
    title: "Status",
    field: "state",
    width: 100,
    hozAlign: "left",
    sorter: "string",
    formatter: function (cell, formatterParams, onRendered) {
      // console.log(cell.getRow().getData());
      const value = cell.getValue();
      const rowData = cell.getRow().getData();
      const className = value === "up" ? "sol_color_green" : "sol_color_point";

      if (value === "up") {
        return `<span class="${className}">${value.toUpperCase()}</span><span style="font-size: 12px; font-weight: 200"> (${
          rowData.haRoleCd
        })</span>`;
      } else {
        return `<span class="${className}">${value.toUpperCase()}</span>`;
      }
    },
  },
  {
    title: "MSN Type",
    field: "serverType",
    width: 100,
    hozAlign: "left",
    sorter: "string",
  },
  {
    title: "MSN Name",
    field: "msnId",
    width: 180,
    hozAlign: "left",
    sorter: "string",
  },
  {
    title: "Message VPN",
    field: "msgVpnName",
    width: 180,
    hozAlign: "left",
    sorter: "string",
  },
  // {
  //   title: "Local State",
  //   field: "state",
  //   width: 120,
  //   hozAlign: "left",
  //   sorter: "string",
  // },
  // {
  //   title: "Queue & Topic",
  //   field: "",
  //   width: 120,
  //   hozAlign: "left",
  //   sorter: "number",
  // },
  {
    title: "Queue & Topic",
    field: "msgSpoolCurrentQueuesAndTopicEndpoints",
    width: 130,
    hozAlign: "left",
    sorter: "number",
    formatter: function (cell: any) {
      return setCommaNum(cell.getValue());
    },
  },
  {
    title: "Replication",
    field: "replicationEnabled",
    width: 120,
    hozAlign: "left",
    sorter: "boolean",
    formatter: function (cell, formatterParams, onRendered) {
      return cell.getValue() ? "ON" : "OFF";
    },
  },
  {
    title: "DMR",
    field: "dmrEnabled",
    width: 80,
    hozAlign: "left",
    sorter: "boolean",
    formatter: function (cell, formatterParams, onRendered) {
      return cell.getValue() ? "ON" : "OFF";
    },
  },
  // {
  //   title: "Replication",
  //   field: "replicationEnabled",
  //   width: 120,
  //   hozAlign: "left",
  //   sorter: "boolean",
  // },
  // {
  //   title: "DMR",
  //   field: "dmrEnabled",
  //   width: 80,
  //   hozAlign: "left",
  //   sorter: "boolean",
  // },

  {
    title: "Messages Queued",
    field: "msgSpoolMsgCount",
    // width: 120,
    hozAlign: "left",
    sorter: "number",
    formatter: function (cell: any) {
      return setCommaNum(cell.getValue());
    },
  },
  {
    title: "Incoming Connections",
    field: "msgVpnConnections",
    // width: 120,
    hozAlign: "left",
    sorter: "number",
    formatter: function (cell: any) {
      const rowData = cell.getRow().getData();
      const vals = setCommaNum(cell.getValue());
      const returnVal = vals
        .toString()
        .concat(" of ")
        .concat(rowData.maxConnectionCount);
      return returnVal;
    },
  },
  {
    title: "Outgoing REST Connections",
    field: "msgVpnConnectionsServiceRestOutgoing",
    // width: 120,
    sorter: "number",
    formatter: function (cell: any) {
      const rowData = cell.getRow().getData();
      const vals = setCommaNum(cell.getValue());
      const returnVal = vals
        .toString()
        .concat(" of ")
        .concat(rowData.serviceRestOutgoingMaxConnectionCount);
      return returnVal;
    },
  },
  // {
  //   title: "value",
  //   field: "maxConnectionCount",
  //   width: 120,
  //   hozAlign: "left",
  // },
  // { title: "value", field: "maxMsgSpoolUsage", width: 120, hozAlign: "left" },
  // { title: "value", field: "replicationRole", width: 120, hozAlign: "left" },
  // {
  //   title: "value",
  //   field: "serviceRestOutgoingMaxConnectionCount",
  //   width: 120,
  //   hozAlign: "left",
  // },
];

export const vpnListData = [
  {
    id: 1,
    msgVpnName: "acme_aos_dev",
  },
  {
    id: 2,
    msgVpnName: "acme_atp_dev",
  },
  {
    id: 3,
    msgVpnName: "default",
  },
];

export const vpnColumns = [
  {
    title: "ID",
    field: "id",
    width: 100,
    sorter: "number",
  },
  {
    title: "Name",
    field: "name",
    sorter: "string",
  },
  {
    title: "Age",
    field: "age",
    sorter: "number",
  },
  {
    title: "Job",
    field: "job",
    sorter: "string",
    // headerFilter: "input",
  },
];

export const vpnData = [
  {
    dmrEnabled: false,
    maxConnectionCount: 100,
    maxMsgSpoolUsage: 0,
    msgSpoolCurrentQueuesAndTopicEndpoints: 11,
    msgSpoolMsgCount: 0,
    msgVpnConnections: 2,
    msgVpnConnectionsServiceRestOutgoing: 3,
    msgVpnName: "acme_aos_dev",
    replicationEnabled: false,
    replicationRole: "standby",
    serviceRestOutgoingMaxConnectionCount: 100,
    state: "up",
  },
  {
    dmrEnabled: false,
    maxConnectionCount: 100,
    maxMsgSpoolUsage: 0,
    msgSpoolCurrentQueuesAndTopicEndpoints: 3,
    msgSpoolMsgCount: 0,
    msgVpnConnections: 2,
    msgVpnConnectionsServiceRestOutgoing: 0,
    msgVpnName: "acme_atp_dev",
    replicationEnabled: false,
    replicationRole: "standby",
    serviceRestOutgoingMaxConnectionCount: 100,
    state: "up",
  },
  {
    dmrEnabled: true,
    maxConnectionCount: 100,
    maxMsgSpoolUsage: 1500,
    msgSpoolCurrentQueuesAndTopicEndpoints: 30,
    msgSpoolMsgCount: 32,
    msgVpnConnections: 3,
    msgVpnConnectionsServiceRestOutgoing: 0,
    msgVpnName: "default",
    replicationEnabled: false,
    replicationRole: "standby",
    serviceRestOutgoingMaxConnectionCount: 100,
    state: "up",
  },
];

export const ProgressData = {
  dmrEnabled: true,
  enabled: true,
  eventConnectionCountThreshold: {
    clearPercent: 60,
    setPercent: 80,
  },
  eventEgressFlowCountThreshold: {
    clearPercent: 60,
    setPercent: 80,
  },
  eventEgressMsgRateThreshold: {
    clearValue: 3000000,
    setValue: 4000000,
  },
  eventEndpointCountThreshold: {
    clearPercent: 60,
    setPercent: 80,
  },
  eventIngressFlowCountThreshold: {
    clearPercent: 60,
    setPercent: 80,
  },
  eventIngressMsgRateThreshold: {
    clearValue: 3000000,
    setValue: 4000000,
  },
  eventLargeMsgThreshold: 1024,
  eventLogTag: "",
  eventMsgSpoolUsageThreshold: {
    clearPercent: 60,
    setPercent: 80,
  },
  eventPublishClientEnabled: false,
  eventPublishMsgVpnEnabled: false,
  eventPublishSubscriptionMode: "off",
  eventPublishTopicFormatMqttEnabled: false,
  eventPublishTopicFormatSmfEnabled: true,
  eventSubscriptionCountThreshold: {
    clearPercent: 60,
    setPercent: 80,
  },
  eventTransactedSessionCountThreshold: {
    clearPercent: 60,
    setPercent: 80,
  },
  eventTransactionCountThreshold: {
    clearPercent: 60,
    setPercent: 80,
  },
  exportSubscriptionsEnabled: false,
  maxConnectionCount: 100,
  maxEgressFlowCount: 1000,
  maxEndpointCount: 1000,
  maxIngressFlowCount: 1000,
  maxMsgSpoolUsage: 1500,
  maxSubscriptionCount: 500000,
  maxTransactedSessionCount: 1000,
  maxTransactionCount: 5000,
  msgVpnName: "default",
  sempOverMsgBusAdminClientEnabled: true,
  sempOverMsgBusAdminDistributedCacheEnabled: true,
  sempOverMsgBusAdminEnabled: true,
  sempOverMsgBusEnabled: true,
  sempOverMsgBusShowEnabled: true,
};

export const ActionData = [
  { id: 1, title: "Go to Summary", url: "/mlsnm", disabled: false },
  { id: 2, title: "Settings", url: "/mlsnm/settings", disabled: false },
  {
    id: 3,
    title: "Stats | Message Stats",
    url: "/mlsnm/stats",
    disabled: true,
  },
  { id: 4, title: "Go Monitoring", url: "/monitor", disabled: false },
  {
    id: 5,
    title: "Go to Messages Queued",
    url: "/channelList",
    disabled: false,
  },
  { id: 6, title: "Delete", disabled: true },
];

export const CardActionData = [
  { id: 1, title: "Go to Summary", url: "/mlsnm", disabled: false },
  { id: 2, title: "Settings", url: "/mlsnm/settings", disabled: false },
  {
    id: 3,
    title: "Stats | Message Stats",
    url: "/mlsnm/stats",
    disabled: false,
  },
  { id: 4, title: "Go Monitoring", url: "/monitor", disabled: false },
  {
    id: 5,
    title: "Go to Messages Queued",
    url: "/channelList",
    disabled: false,
  },
  { id: 6, title: "Delete", disabled: false },
];

export const MessageVpnData = [
  { id: 1, title: "Summary", url: "summary" },
  { id: 2, title: "Settings", url: "settings" },
  { id: 3, title: "Services", url: "services" },
  { id: 4, title: "Replication", url: "replication" },
  { id: 5, title: "Proxies", url: "proxies" },
  { id: 6, title: "Stats", url: "stats" },
];

export const ConfigStatusData = [
  { id: 1, title: "Replication", value: "Off" },
  { id: 2, title: "DMR", value: "Off" },
  { id: 3, title: "Subscriptions", value: "0" },
  { id: 4, title: "Replay", value: "State" },
];

export const ConfigData = [
  {
    status: "Active",
    statusData: "ON",
    contents: "mes-broker1 192.168.19.808",
  },
  {
    status: "Standby",
    statusData: "OFF",
    contents: "mes-broker2 192.168.19.808",
  },
  {
    status: "Monitor",
    statusData: "ON",
    contents: "mes-broker3 192.168.19.808",
  },
];

export const InformationData = [
  {
    key1: "Messages Queued",
    key2: "Messages Quota",
    value1: "174.4 MB",
    value2: "100.0 MB",
    percentage: 32,
  },
  {
    key1: "Incomming Connections",
    key2: "Configured Limit",
    value1: "1",
    value2: "100",
    percentage: 32,
  },
  {
    key1: "Queue REST Connections",
    key2: "Configured Limit",
    value1: "1",
    value2: "100",
    percentage: 12,
  },
  {
    key1: "Current Consumers",
    key2: "Configured Limit",
    value1: "174.4 MB",
    value2: "100.0 MB",
    percentage: 49,
  },
];

export const SETTING_DATA = {
  msgVpnName: "",
  enabled: true,
  maxMsgSpoolUsage: 0,
  eventMsgSpoolUsageThreshold: {
    clearPercent: 0,
    // clearValue: 0,
    setPercent: 0,
    // setValue: 0,
  },
  maxTransactedSessionCount: 0,
  eventTransactedSessionCountThreshold: {
    clearPercent: 0,
    // clearValue: 0,
    setPercent: 0,
    // setValue: 0,
  },
  maxTransactionCount: 0,
  eventTransactionCountThreshold: {
    clearPercent: 0,
    // clearValue: 0,
    setPercent: 0,
    // setValue: 0,
  },
  maxEndpointCount: 0,
  eventEndpointCountThreshold: {
    clearPercent: 0,
    // clearValue: 0,
    setPercent: 0,
    // setValue: 0,
  },
  maxEgressFlowCount: 0,
  eventEgressFlowCountThreshold: {
    clearPercent: 0,
    // clearValue: 0,
    setPercent: 0,
    // setValue: 0,
  },
  maxIngressFlowCount: 0,
  eventIngressFlowCountThreshold: {
    clearPercent: 0,
    // clearValue: 0,
    setPercent: 0,
    // setValue: 0,
  },
  maxConnectionCount: 0,
  eventConnectionCountThreshold: {
    clearPercent: 0,
    // clearValue: 0,
    setPercent: 0,
    // setValue: 0,
  },
  eventEgressMsgRateThreshold: {
    clearValue: 0,
    setValue: 0,
  },
  eventIngressMsgRateThreshold: {
    clearValue: 0,
    setValue: 0,
  },
  maxSubscriptionCount: 0,
  eventSubscriptionCountThreshold: {
    clearPercent: 0,
    // clearValue: 0,
    setPercent: 0,
    // setValue: 0,
  },
  maxKafkaBrokerConnectionCount: 0,
  dmrEnabled: false,
  exportSubscriptionsEnabled: false,
  eventLargeMsgThreshold: 0,
  eventLogTag: "",
  eventPublishClientEnabled: false,
  eventPublishMsgVpnEnabled: false,
  eventPublishSubscriptionMode: "off",
  eventPublishTopicFormatMqttEnabled: false,
  eventPublishTopicFormatSmfEnabled: false,
  sempOverMsgBusEnabled: false,
  sempOverMsgBusAdminEnabled: false,
  sempOverMsgBusAdminClientEnabled: false,
  sempOverMsgBusAdminDistributedCacheEnabled: false,
  sempOverMsgBusShowEnabled: false,
};

export const INFORMATION_DATA = [
  {
    msnId: "",
    url: null,
    port: null,
    haRoleCode: "",
    status: "",
    failoverStatus: "active",
  },
];

export const INFORMATION_DATA2 = {
  enabled: false,
  maxMsgSpoolUsage: 0,
};

const setCommaNum = (num: any) => {
  if (num && num >= -1) {
    const numVal = num.toLocaleString("ko-KR");
    return numVal;
  } else {
    return 0;
  }
};

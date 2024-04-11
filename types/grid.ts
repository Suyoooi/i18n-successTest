export interface GridProps {
  title?: string;
  data: any[];
  columns: any[];
}

export interface GridValueType {
  key: string;
  value: string;
}

export interface vpnDataType {
  mlsnSn: number;
  serverType: string;
  msnId: string;
  dmrEnabled: boolean;
  maxConnectionCount: number;
  maxMsgSpoolUsage: number;
  msgSpoolCurrentQueuesAndTopicEndpoints: number;
  msgSpoolMsgCount: number;
  msgVpnConnections: number;
  msgVpnConnectionsServiceRestOutgoing: number;
  msgVpnName: string;
  replicationEnabled: boolean;
  replicationRole: string;
  serviceRestOutgoingMaxConnectionCount: number;
  state: string;
  haRoleCd: string;
}

export interface CongigurationProps {
  status: string;
  statusData: string;
  contents: string;
}

export interface InformationProps {
  key1: string;
  key2: string;
  value1: string;
  value2: string;
  percentage: number;
}

export interface ActionDataProps {
  id: number;
  title: string;
  url?: any;
}

export const pageOptions = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

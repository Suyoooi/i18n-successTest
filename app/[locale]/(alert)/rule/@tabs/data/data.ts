import { ReactTabulatorOptions } from "react-tabulator";

export const RULE_OPTION: ReactTabulatorOptions = {
  layout: "fitColumns",
  placeholder: "No data found.",
  height: 300,
};

// vpn 이면서 Threshold 이고, # 인 경우
export const vpnThSh = [
  { id: "clct_dt", value: "Create Date" },
  { id: "reg_dt", value: "Registration Date" },
  { id: "msn_id", value: "MSN Name" },
  { id: "mlsn_id", value: "MLSN Name" },
  { id: "in_byte_rate", value: "Inbound Bytes Rate" },
  { id: "in_msg_rate", value: "Inbound Message Rate" },
  { id: "out_byte_rate", value: "Outbound Bytes Rate" },
  { id: "out_msg_rate", value: "Outbound Message Rate" },
  { id: "pend_msg_cnt", value: "Pending Message Count" },
  { id: "pend_msg_size", value: "Pending Message Size" },
  { id: "max_pend_msg_size", value: "Pending Message Size Limit" },
  { id: "client_cnt", value: "Client Count" },
  { id: "_inspection_type", value: "Inspection Type" },
  { id: "_upper", value: "Upper Clitical Limit" },
  { id: "_lower", value: "Lower Clitical Limit" },
  { id: "_column", value: "Column" },
  { id: "_value", value: "Value" },
];

// vpn 이면서 Threshold 이고, % 인 경우
export const vpnThPer = [
  { id: "clct_dt", value: "Create Date" },
  { id: "reg_dt", value: "Registration Date" },
  { id: "msn_id", value: "MSN Name" },
  { id: "mlsn_id", value: "MLSN Name" },
  { id: "in_byte_rate", value: "Inbound Bytes Rate" },
  { id: "in_msg_rate", value: "Inbound Message Rate" },
  { id: "out_byte_rate", value: "Outbound Bytes Rate" },
  { id: "out_msg_rate", value: "Outbound Message Rate" },
  { id: "pend_msg_cnt", value: "Pending Message Count" },
  { id: "pend_msg_size", value: "Pending Message Size" },
  { id: "max_pend_msg_size", value: "Pending Message Size Limit" },
  { id: "client_cnt", value: "Client Count" },
  { id: "_inspection_type", value: "Inspection Type" },
  { id: "_upper_rate", value: "Upper Rate Threshold" },
  { id: "_lower_rate", value: "Lower Rate Threshold" },
  { id: "_column", value: "Column" },
  { id: "_value", value: "Value" },
];

// vpn 이면서 Nelson Rule 인 경우
export const vpnNel = [
  { id: "clct_dt", value: "Create Date" },
  { id: "reg_dt", value: "Registration Date" },
  { id: "msn_id", value: "MSN Name" },
  { id: "mlsn_id", value: "MLSN Name" },
  { id: "in_byte_rate", value: "Inbound Bytes Rate" },
  { id: "in_msg_rate", value: "Inbound Message Rate" },
  { id: "out_byte_rate", value: "Outbound Bytes Rate" },
  { id: "out_msg_rate", value: "Outbound Message Rate" },
  { id: "pend_msg_cnt", value: "Pending Message Count" },
  { id: "pend_msg_size", value: "Pending Message Size" },
  { id: "max_pend_msg_size", value: "Pending Message Size Limit" },
  { id: "client_cnt", value: "Client Count" },
  { id: "_inspection_type", value: "Inspection Type" },
  { id: "_nelsonrule_name", value: "Nelson Rule Name" },
  { id: "_nelsonrule_mean", value: "Nelson Rule Average" },
  { id: "_nelsonrule_std", value: "Nelson Rule Standard Deviation" },
  { id: "_column", value: "Column" },
  { id: "_value", value: "Value" },
];

// queue 이면서 Threshold 이고, # 인 경우
export const queueThSh = [
  { id: "clct_dt", value: "Create Date" },
  { id: "reg_dt", value: "Registration Date" },
  { id: "msn_id", value: "MSN Name" },
  { id: "mlsn_id", value: "MLSN Name" },
  { id: "msc_id", value: "Channel Name" },
  { id: "in_byte_rate", value: "Inbound Bytes Rate" },
  { id: "in_msg_rate", value: "Inbound Message Rate" },
  { id: "out_byte_rate", value: "Outbound Bytes Rate" },
  { id: "out_msg_rate", value: "Outbound Message Rate" },
  { id: "pend_msg_cnt", value: "Pending Message Count" },
  { id: "pend_msg_size", value: "Pending Message Size" },
  { id: "max_cnsmr_cnt", value: "Cunsumer Count Limit" },
  { id: "_inspection_type", value: "Inspection Type" },
  { id: "_upper", value: "Upper Clitical Limit" },
  { id: "_lower", value: "Lower Clitical Limit" },
  { id: "_column", value: "Column" },
  { id: "_value", value: "Value" },
];

// queue 이면서 Threshold 이고, % 인 경우
export const queueThPer = [
  { id: "clct_dt", value: "Create Date" },
  { id: "reg_dt", value: "Registration Date" },
  { id: "msn_id", value: "MSN Name" },
  { id: "mlsn_id", value: "MLSN Name" },
  { id: "msc_id", value: "Channel Name" },
  { id: "in_byte_rate", value: "Inbound Bytes Rate" },
  { id: "in_msg_rate", value: "Inbound Message Rate" },
  { id: "out_byte_rate", value: "Outbound Bytes Rate" },
  { id: "out_msg_rate", value: "Outbound Message Rate" },
  { id: "pend_msg_cnt", value: "Pending Message Count" },
  { id: "pend_msg_size", value: "Pending Message Size" },
  { id: "max_cnsmr_cnt", value: "Cunsumer Count Limit" },
  { id: "_inspection_type", value: "Inspection Type" },
  { id: "_upper_rate", value: "Upper Rate Threshold" },
  { id: "_lower_rate", value: "Lower Rate Threshold" },
  { id: "_column", value: "Column" },
  { id: "_value", value: "Value" },
];

// queue 이면서 Nelson Rule 인 경우
export const queueNel = [
  { id: "clct_dt", value: "Create Date" },
  { id: "reg_dt", value: "Registration Date" },
  { id: "msn_id", value: "MSN Name" },
  { id: "mlsn_id", value: "MLSN Name" },
  { id: "msc_id", value: "Channel Name" },
  { id: "in_byte_rate", value: "Inbound Bytes Rate" },
  { id: "in_msg_rate", value: "Inbound Message Rate" },
  { id: "out_byte_rate", value: "Outbound Bytes Rate" },
  { id: "out_msg_rate", value: "Outbound Message Rate" },
  { id: "pend_msg_cnt", value: "Pending Message Count" },
  { id: "pend_msg_size", value: "Pending Message Size" },
  { id: "max_cnsmr_cnt", value: "Cunsumer Count Limit" },
  { id: "_inspection_type", value: "Inspection Type" },
  { id: "_nelsonrule_name", value: "Nelson Rule Name" },
  { id: "_nelsonrule_mean", value: "Nelson Rule Average" },
  { id: "_nelsonrule_std", value: "Nelson Rule Standard Deviation" },
  { id: "_column", value: "Column" },
  { id: "_value", value: "Value" },
];

export const NELSON_LEVEL_OPTIONS = [
  { id: "1", value: 1, label: "Rule-1" },
  { id: "2", value: 2, label: "Rule-2" },
  { id: "3", value: 3, label: "Rule-3" },
  { id: "4", value: 4, label: "Rule-4" },
  { id: "5", value: 5, label: "Rule-5" },
  { id: "6", value: 6, label: "Rule-6" },
  { id: "7", value: 7, label: "Rule-7" },
  { id: "8", value: 8, label: "Rule-8" },
];

export const LEVEL_OPTIONS = [
  { id: "advisory", value: "advisory", label: "Advisory" },
  { id: "warning", value: "warning", label: "Warning" },
  { id: "critical", value: "critical", label: "Critical" },
];

export const THRESHOLDS_VALUE_TYPE = [
  { id: "percent", value: "percent", label: "%", rule: "CPRTIUP, CPRTIDOWN" },
  {
    id: "number",
    value: "number",
    label: "# (Number)",
    rule: "CPTHIUP, CPRDOWN",
  },
  {
    id: "expression",
    value: "expression",
    label: "Expression",
    rule: "CPEPIEXP",
  },
];

// export const INSPECTION_METHOD1 = [
//   { cdDesc: "nelson", cdId: "NELSON_RULE_INSPECTION", cdNm: "Nelson" },
// ];

// export const INSPECTION_METHOD2 = [
//   { cdDesc: "thresholds", cdId: "THRESHOLD_INSPECTION", cdNm: "Thresholds" },
// ];
// export const INSPECTION_METHOD3 = [
//   { cdDesc: "nelson", cdId: "NELSON_RULE_INSPECTION", cdNm: "Nelson" },
//   { cdDesc: "thresholds", cdId: "THRESHOLD_INSPECTION", cdNm: "Thresholds" },
// ];

// export const INSPECTION_METHOD1 = [
//   { id: "nelson", value: "NELSON_RULE_INSPECTION", label: "Nelson" },
// ];

// export const INSPECTION_METHOD2 = [
//   { id: "thresholds", value: "THRESHOLD_INSPECTION", label: "Thresholds" },
// ];

// export const INSPECTION_METHOD3 = [
//   { id: "thresholds", value: "THRESHOLD_INSPECTION", label: "Thresholds" },
//   { id: "nelson", value: "NELSON_RULE_INSPECTION", label: "Nelson" },
// ];

export const NELSON_RULE = [
  {
    id: 1,
    value: 1,
    label:
      "Rule 1. One point is more than 3 standard deviations from the mean.",
  },
  {
    id: 2,
    value: 2,
    label:
      "Rule 2. Nine (or more) points in a row are on the same side of the mean.",
  },
  {
    id: 3,
    value: 3,
    label:
      "Rule 3. Six (or more) points in a row are continually increasing (or decreasing).",
  },
  {
    id: 4,
    value: 4,
    label:
      "Rule 4. Fourteen (or more) points in a row alternate in direction, increasing then decreasing.",
  },
  {
    id: 5,
    value: 5,
    label:
      "Rule 5. Two (or three) out of three points in a row are more than 2 standard deviations from the mean in the same direction.",
  },
  {
    id: 6,
    value: 6,
    label:
      "Rule 6. Four (or five) out of five points in a row are more than 1 standard deviation from the mean in the same direction.",
  },
  {
    id: 7,
    value: 7,
    label:
      "Rule 7. Fifteen points in a row are all within 1 standard deviation of the mean on either side of the mean.",
  },
  {
    id: 8,
    value: 8,
    label:
      "Rule 8. Eight points in a row exist, but none within 1 standard deviation of the mean, and the points are in both directions from the mean.",
  },
];

export const VPN_LIST = [
  { name: "MES01 > mesVPN01", rule: "Alert01-Maximum Message Spool Usage + 3" },
  { name: "MES01 > mesVPN02", rule: "Alert02-Maximum Transacted Sessions + 2" },
  { name: "MES01 > mesVPN03", rule: "Alert03-Maximum Incoming Flows + 2" },
  { name: "EDP01 > edpVPN01", rule: "Alert04-Incoming Rate 일정 이상 + 1" },
  { name: "EDP01 > edpVPN02", rule: "Alert05-Outgoing Rate 일정 이상 + 2" },
  { name: "EDP01 > edpVPN03", rule: "Alert01-Maximum Message Spool Usage + 2" },
  { name: "CDP01 > cdpVPN01", rule: "Alert01-Maximum Message Spool Usage + 3" },
];

export const QUEUE_LIST = [
  { name: "testQueue01", rule: "Messages Queued 80% + 1" },
  { name: "testQueue02", rule: "Messages Queued 80% + 1" },
  { name: "testQueue03", rule: "설정된 경고 규칙이 없습니다." },
  { name: "testQueue04", rule: "Messages Queued 80% + 1" },
  { name: "testQueue05", rule: "Messages Queued 80% + 1" },
  { name: "testQueue06", rule: "Messages Queued 80% + 1" },
  { name: "testQueue07", rule: "Messages Queued 80% + 1" },
];

export const ALERT_LEVEL_CRITICAL_VALUE = "Critical";
export const ALERT_LEVEL_MAJOR_VALUE = "Major";
export const ALERT_LEVEL_MINOR_VALUE = "Minor";
export const ALERT_LEVEL_INFO_VALUE = "Info";

export const ALERT_LEVEL_CRITICAL = "CRI";
export const ALERT_LEVEL_MAJOR = "MAJ";
export const ALERT_LEVEL_MINOR = "MIN";
export const ALERT_LEVEL_INFO = "INFO";

export const ALERT_STATUS_DET_VALUE = "Detected";
export const ALERT_STATUS_ACT_VALUE = "Working";
export const ALERT_STATUS_CNF_VALUE = "Confirmed";
export const ALERT_STATUS_RES_VALUE = "Resolved";

export const ALERT_STATUS_DET = "DET";
export const ALERT_STATUS_ACT = "ACT";
export const ALERT_STATUS_CNF = "CNF";
export const ALERT_STATUS_RES = "RES";

// export const ChartRedColor = "#F5475B";
// export const ChartOrangeColor = "#FF800C";
// export const ChartYellowColor = "#FFE70D";
// export const ChartGreenColor = "#03A40A";
// export const ChartGrayFontColor = "#A2A4A9";

export const ChartRedColor = "#DE0202";
export const ChartOrangeColor = "#FF800C";
export const ChartYellowColor = "#FFE70D";
export const ChartGreenColor = "#03C75A";
export const ChartGrayFontColor = "#A2A4A9";

export const TYPE_ANOMALY = "anomaly";
export const TYPE_FAILURE = "failure";
export const TYPE_EXCEPTION = "exception";

import { InspectionRuleParamType } from "@/app/[locale]/(alert)/addRule/type/type";
import { SetStateAction, createContext, useContext } from "react";

interface AddRuleContextType {
  // step1
  targetType: string;
  setTargetType: React.Dispatch<React.SetStateAction<string>>;
  vpnName: string;
  setVpnName: React.Dispatch<React.SetStateAction<string>>;
  brokerName: string;
  setBrokerName: React.Dispatch<React.SetStateAction<string>>;
  queueName: string;
  setQueueName: React.Dispatch<React.SetStateAction<string>>;
  selectedVpn: string;
  setSelectedVpn: React.Dispatch<React.SetStateAction<string>>;
  selectedMlsnData: string;
  setSelectedMlsnData: React.Dispatch<React.SetStateAction<string>>;
  vpnBtn: boolean;
  setVpnBtn: React.Dispatch<React.SetStateAction<boolean>>;
  queueBtn: boolean;
  setQueueBtn: React.Dispatch<React.SetStateAction<boolean>>;
  // step2
  targetItem: string;
  setTargetItem: React.Dispatch<React.SetStateAction<string>>;
  targetItemName: string;
  setTargetItemName: React.Dispatch<React.SetStateAction<string>>;
  inspectionType: string;
  setInspectionType: React.Dispatch<React.SetStateAction<string>>;
  inspectionMethod: string;
  setInspectionMethod: React.Dispatch<React.SetStateAction<string>>;
  inspectionRule: string;
  setInspectionRule: React.Dispatch<React.SetStateAction<string>>;
  inspectionRuleParam: InspectionRuleParamType;
  setInspectionRuleParam: React.Dispatch<
    SetStateAction<InspectionRuleParamType>
  >;
  selectedCdInfo: string;
  setSelectedCdInfo: React.Dispatch<React.SetStateAction<string>>;
  alertLevel: string;
  setAlertLevel: React.Dispatch<React.SetStateAction<string>>;
  aboveBtn: boolean;
  setAboveBtn: React.Dispatch<React.SetStateAction<boolean>>;
  belowBtn: boolean;
  setBelowBtn: React.Dispatch<React.SetStateAction<boolean>>;
  stdVaild: boolean;
  setStdVaild: React.Dispatch<React.SetStateAction<boolean>>;
  alertRuleName: string;
  setAlertRuleName: React.Dispatch<React.SetStateAction<string>>;
  msgTemp: string;
  setMsgTemp: React.Dispatch<React.SetStateAction<string>>;
  selectedValueType: string;
  setSelectedValueType: React.Dispatch<React.SetStateAction<string>>;
  alertMsg: string;
  setAlertMsg: React.Dispatch<React.SetStateAction<string>>;
  checkValue: number;
  setCheckValue: React.Dispatch<React.SetStateAction<number>>;
  notiCount: number;
  setNotiCount: React.Dispatch<React.SetStateAction<number>>;
  notiPeriod: number;
  setNotiPeriod: React.Dispatch<React.SetStateAction<number>>;
}

export const AddRuleContext = createContext<AddRuleContextType | undefined>(
  undefined
);

export const useAddRuleContext = () => {
  const context = useContext(AddRuleContext);
  if (!context) {
    throw new Error("error");
  }
  return context;
};

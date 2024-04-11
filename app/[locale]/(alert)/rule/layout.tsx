"use client";

import { useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/hook/hook";
import { AddRuleContext } from "@/context/alert/addRuleContext";
import { InspectionRuleParamType } from "../addRule/type/type";

type ValidationRule = {
  check: () => boolean;
  message: string;
};

export default function Layout(props: {
  tabs: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [index, setIndex] = useState(0);
  // step1
  const [targetType, setTargetType] = useState<string>("MLSN");
  const [vpnName, setVpnName] = useState<string>("");
  const [brokerName, setBrokerName] = useState<string>("");
  const [queueName, setQueueName] = useState<string>("");
  const [vpnBtn, setVpnBtn] = useState<boolean>(true);
  const [queueBtn, setQueueBtn] = useState<boolean>(false);
  const [selectedVpn, setSelectedVpn] = useState<string>("");
  const [selectedMlsnData, setSelectedMlsnData] = useState<string>("");
  // step2
  const [targetItemName, setTargetItemName] = useState<string>("");
  const [targetItem, setTargetItem] = useState<string>("");
  const [inspectionMethod, setInspectionMethod] = useState<string>("THRESHOLD");
  const [inspectionRule, setInspectionRule] = useState<string>("CPRTIUP");
  const [inspectionType, setInspectionType] = useState<string>("percent");
  const [inspectionRuleParam, setInspectionRuleParam] =
    useState<InspectionRuleParamType>({
      thresholdValue: 0,
      nsRules: 3,
      nsRuleMean: 10,
      nsRuleStd: 0.1,
    });
  const [alertLevel, setAlertLevel] = useState<string>("CRI");
  const [aboveBtn, setAboveBtn] = useState<boolean>(false);
  const [belowBtn, setBelowBtn] = useState<boolean>(false);
  const [selectedValueType, setSelectedValueType] = useState<string>("percent");
  const [stdVaild, setStdVaild] = useState<boolean>(false);
  const [selectedCdInfo, setSelectedCdInfo] = useState<string>("");
  // step3
  const [msgTemp, setMsgTemp] = useState<string>("");
  const [alertRuleName, setAlertRuleName] = useState<string>("");
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [checkValue, setCheckValue] = useState<number>(0);
  const [notiCount, setNotiCount] = useState<number>(2);
  const [notiPeriod, setNotiPeriod] = useState<number>(60);

  console.log("targetType:::", targetType);
  console.log("vpnName:::", vpnName);
  console.log("brokerName:::", brokerName);
  console.log("queueName:::", queueName);
  console.log("targetItemName:::", targetItemName);
  console.log("targetItem:::", targetItem);
  console.log("inspectionMethod:::", inspectionMethod);
  console.log("selectedCdInfo:::", selectedCdInfo);
  console.log("inspectionRule:::", inspectionRule);
  console.log("inspectionRuleParam:::", inspectionRuleParam);
  console.log("alertLevel:::", alertLevel);
  console.log("alertRuleName:::", alertRuleName);
  console.log("alertMsg:::", alertMsg);
  console.log("checkValue:::", checkValue);
  console.log("notiCount:::", notiCount);
  console.log("notiPeriod:::", notiPeriod);
  console.log("inspectionType:::", inspectionType);

  const activeLink = (id: number, contentUrl: string, disableGbn: boolean) => {
    if (disableGbn) {
      return contentUrl === pathname ? "nav-link active" : "nav-link";
    } else {
      return "nav-link disabled";
    }
  };

  const data = [
    {
      id: 0,
      title: "Select Target For Alert",
      contentUrl: "/rule/step1",
      disableGbn: true,
    },
    {
      id: 1,
      title: "Inspection Method & Value Configuration",
      contentUrl: "/rule/step2",
      disableGbn: true,
    },
    {
      id: 2,
      title: "Compose Alert Message",
      contentUrl: "/rule/step3",
      disableGbn: true,
    },
    {
      id: 3,
      title: "Configure Transmission Channel & Recipients",
      contentUrl: "/rule/step4",
      disableGbn: true,
    },
  ];

  const handleCancelClick = () => {
    router.push("/msg");
  };

  const validationRules: Record<string, ValidationRule> = {
    "/rule/step1": {
      check: () =>
        targetType === "MLSN"
          ? vpnName.trim() !== ""
          : brokerName.trim() !== "",
      message:
        "Please ensure all required fields are filled out before moving to the next step.",
    },
    "/rule/step2": {
      check: () => targetItem.trim() !== "",
      message:
        "Please select a target item and configure its inspection method.",
    },
    "/rule/step3": {
      check: () => msgTemp.trim() !== "",
      message: "Please select a message template.",
    },
  };

  const fnMovePage = (url: string, id: number) => {
    const currentValidation = validationRules[pathname];

    if (currentValidation && !currentValidation.check()) {
      alert(currentValidation.message);
    } else {
      console.log(url);
      setIndex(id);
      router.push(url);
    }
  };

  return (
    <>
      <AddRuleContext.Provider
        value={{
          targetType,
          setTargetType,
          vpnName,
          setVpnName,
          brokerName,
          setBrokerName,
          queueName,
          setQueueName,
          selectedVpn,
          setSelectedVpn,
          vpnBtn,
          setVpnBtn,
          queueBtn,
          setQueueBtn,
          selectedMlsnData,
          setSelectedMlsnData,
          targetItemName,
          setTargetItemName,
          targetItem,
          setTargetItem,
          inspectionType,
          setInspectionType,
          selectedCdInfo,
          setSelectedCdInfo,
          inspectionMethod,
          setInspectionMethod,
          inspectionRule,
          setInspectionRule,
          inspectionRuleParam,
          setInspectionRuleParam,
          alertLevel,
          setAlertLevel,
          alertRuleName,
          setAlertRuleName,
          stdVaild,
          setStdVaild,
          aboveBtn,
          setAboveBtn,
          belowBtn,
          setBelowBtn,
          selectedValueType,
          setSelectedValueType,
          msgTemp,
          setMsgTemp,
          alertMsg,
          setAlertMsg,
          checkValue,
          setCheckValue,
          notiCount,
          setNotiCount,
          notiPeriod,
          setNotiPeriod,
        }}
      >
        <div>
          <div className="content__wrap">
            <div className="sol_breadcrumb_area">
              <div className="row">
                <div className="row d-flex col-md-8">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <a href="/msg">Alert Management</a> | Anomalies
                      </li>
                      <li className="breadcrumb-item">Add Alert Rule</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
            <div className="tab-base">
              <div className="position-relative">
                <ul className="nav nav-callout" role="tablist">
                  {data.map((item) => (
                    <li className="nav-item" role="presentation" key={item.id}>
                      <button
                        className={activeLink(
                          item.id,
                          item.contentUrl,
                          item.disableGbn
                        )}
                        data-bs-toggle="tab"
                        data-bs-target="#tabsHome"
                        type="button"
                        role="tab"
                        aria-controls="home"
                        aria-selected="true"
                        onClick={() => fnMovePage(item.contentUrl, item.id)}
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="d-flex position-absolute justify-content-end gap-2 sol_tab_rigbtn">
                  <a
                    className="btn hstack btn-outline-light"
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </a>
                </div>
              </div>
              {data
                .filter((item) => index === item.id)
                .map((item) => (
                  <div key={item.id}>{props.tabs}</div>
                ))}
            </div>
          </div>
        </div>
      </AddRuleContext.Provider>
    </>
  );
}

"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  setSelectedRow,
  setSelectedId,
  setSelectedMsnId,
} from "@/redux/slices/vpn/vpnSlice";
import { vpnDataType } from "@/types/grid";
import { useAppDispatch } from "@/hook/hook";
import { CardActionData } from "@/data/gridData";
import { useRouter } from "next/navigation";
import { setVpnInfo } from "@/redux/slices/vpn/monitorVpnSlice";

interface BoxProps {
  data: vpnDataType[];
}

const VpnCard: React.FC<BoxProps> = ({ data }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedVpn, setSelectedVpn] = useState<string>("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  useEffect(() => {
    console.log("메뉴 클릭", selectedVpn);
  }, [selectedVpn]);

  const handleDeleteClick = () => {
    alert(`VPN ${selectedVpn}를 삭제하시겠습니까?`);
    setOpenMenu(null);
  };

  const handleCardClick = (item: any) => {
    dispatch(setSelectedRow({ msgVpnName: item.msgVpnName }));
    dispatch(setSelectedId({ mlsnSn: item.mlsnSn }));
    dispatch(setSelectedMsnId({ msnId: item.msnId }));
    dispatch(setVpnInfo({ msgVpnName: item.msgVpnName, msnId: item.msnId }));

    router.push("/mlsnm");
  };

  const handleActionTitleClick = (item: any, vpnItem: any) => {
    // item.id가 4인 경우
    if (item.id === 4) {
      const monitorUrl = `${item.url}?msn=${vpnItem.msnId}&mlsn=${vpnItem.msgVpnName}`;
      router.push(monitorUrl);
    } else if (item.id === 6) {
      // alert("삭제하시겠습니까?");
      return;
    } else if (item.id === 3) {
      return;
    } else {
      router.push(item.url);
    }

    dispatch(setSelectedRow({ msgVpnName: vpnItem.msgVpnName }));
    dispatch(setSelectedId({ mlsnSn: vpnItem.mlsnSn }));
    dispatch(setSelectedMsnId({ msnId: vpnItem.msnId }));
    dispatch(
      setVpnInfo({ msgVpnName: vpnItem.msgVpnName, msnId: vpnItem.msnId })
    );
  };

  // 백그라운드 클릭했을 때 모달 닫히도록 설정
  const dropdownRefs = useRef<Array<HTMLDivElement | null>>([]);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const isOutside = dropdownRefs.current.every(
        (ref, idx) => !ref?.contains(event.target as Node) || openMenu !== idx
      );
      if (isOutside) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [openMenu]);

  const setCommaNum = (num: any) => {
    if (num && num >= -1) {
      const numVal = num.toLocaleString("ko-KR");
      return numVal;
    } else {
      return 0;
    }
  };

  return (
    <div
      className="sol_card_container"
      style={{ marginTop: 10, marginLeft: -10 }}
    >
      {data?.map((item, index) => {
        const setDropdownRef = (element: HTMLDivElement) => {
          dropdownRefs.current[index] = element;
        };
        const replicationStatus = item.replicationEnabled;
        const dmrEnabledStatus = item.dmrEnabled;

        return (
          <div
            ref={setDropdownRef}
            className="sol_box_p10 sol_card"
            style={{
              cursor: "pointer",
            }}
            key={index}
            onClick={() => handleCardClick(item)}
          >
            <h4 className="sol_h4_gray">{item.msgVpnName}</h4>
            {/* 드롭다운 메뉴 */}
            <div className="btn-group">
              <a
                className="btn btn-icon hstack sol_btn_hamburger"
                data-bs-toggle="dropdown"
                onClick={(event) => event.stopPropagation()}
              >
                <i className="sol_i_hamburger" />
              </a>
              <ul className="dropdown-menu">
                {CardActionData.map((actionItem) => (
                  <li key={actionItem.id}>
                    <a
                      className={`dropdown-item ${
                        actionItem.disabled ? `disabled` : ``
                      }`}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleActionTitleClick(actionItem, item);
                      }}
                      style={{
                        cursor:
                          actionItem.id === 3 || actionItem.id === 6
                            ? "default"
                            : "pointer",
                        opacity:
                          actionItem.id === 3 || actionItem.id === 6 ? 0.5 : 1,
                        color: actionItem.id === 6 ? "#FE7366" : "#e1e7f0",
                      }}
                    >
                      {actionItem.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-2">
              <ul className="sol_card_list sol_mtb_15">
                <li>
                  <span className="sol_tit">MSN Type :</span>
                  <span className="sol_data">&nbsp;{item.serverType}</span>
                </li>
                <li>
                  <span className="sol_tit">MSN Name :</span>
                  <span className="sol_data">&nbsp;{item.msnId}</span>
                </li>
              </ul>

              <ul className="sol_card_list mt-2 sol_mtb_15">
                <li>
                  <span className="sol_tit">Status :</span>
                  <span
                    className={` ${
                      item.state === "up"
                        ? "sol_color_green"
                        : "sol_color_point"
                    }`}
                  >
                    &nbsp;{item.state === "up" ? "UP" : "DOWN"}
                  </span>
                  <span className="sol_data">
                    &nbsp;
                    {item.state === "up" && item.haRoleCd === "PRI"
                      ? "(Primary)"
                      : item.state === "up" && item.haRoleCd === "SEC"
                      ? "(Secondary)"
                      : item.state === "up" && item.haRoleCd === "OFF"
                      ? ""
                      : ""}
                  </span>
                </li>
                <li>
                  <span className="sol_tit">Replcation</span>
                  <span
                    // className={` ${
                    //   replicationStatus ? "sol_data" : "sol_color_point"
                    // }`}
                    className="sol_data"
                  >
                    &nbsp;{replicationStatus ? "ON" : "OFF"}
                  </span>
                </li>
                <li>
                  <span className="sol_tit">DMR :</span>
                  <span className="sol_data">
                    &nbsp;{dmrEnabledStatus ? "ON" : "OFF"}
                  </span>
                </li>
              </ul>
              <ul className="sol_card_list mt-2">
                <li>
                  <span className="sol_tit">Queues & Topic Endpoints:</span>
                  <span className="sol_data">
                    &nbsp;
                    {setCommaNum(item.msgSpoolCurrentQueuesAndTopicEndpoints)}
                  </span>
                </li>
                <li>
                  <span className="sol_tit">Messages Queued :</span>
                  <span className="sol_data">
                    &nbsp;{setCommaNum(item.msgSpoolMsgCount)}
                  </span>
                </li>
                <li>
                  <span className="sol_tit">Incoming Connections</span>
                  <span className="sol_data">
                    &nbsp;{item.msgVpnConnections || 0} of{" "}
                    {setCommaNum(item.maxConnectionCount)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VpnCard;

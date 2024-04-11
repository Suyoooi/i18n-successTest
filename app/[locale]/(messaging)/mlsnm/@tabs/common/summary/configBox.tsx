"use client";

import { ConfigStatusData } from "@/data/gridData";
import { useAppSelector } from "@/hook/hook";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

interface ConfigProps {
  refreshTime: any;
}

const ConfigBox: React.FC<ConfigProps> = ({ refreshTime }) => {
  const selectedMsnId = useAppSelector((state) => state.isVpn.selectedMsnId);

  const [openModal, setOpenModal] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [data, setData] = useState<any>([]);

  const fetchData = async () => {
    const url = `/api/v2/msgVpns/ha-config-status`;
    const msn = selectedMsnId?.msnId;

    try {
      const params = {
        msn: msn,
      };
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
        params,
      });
      const DataVal = response.data;

      const sortedArray: any[] = DataVal.sort((a: any, b: any) => {
        const order: Record<string, number> = { PRI: 1, SEC: 2, MON: 3 };
        return order[a.haRoleCode] - order[b.haRoleCode];
      });
      setData(sortedArray);
      console.log("::configBox::데이터", DataVal);
    } catch (error) {
      console.error("에러:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTime]);

  // 버튼 클릭했을 때 모달 보이도록 설정
  const handleMenuClick = (
    event: React.MouseEvent,
    item: any,
    index: number
  ) => {
    event.stopPropagation();
    setOpenModal((prev) => (prev === index ? null : index));
  };

  // 백그라운드 클릭했을 때 모달 닫히도록 설정
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleOutsideClick = (event: { target: any }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenModal(null);
        setHoveredIndex(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div
      className="sol_card_container"
      ref={dropdownRef as React.RefObject<HTMLDivElement>}
      style={{ marginLeft: -10, marginTop: -10 }}
    >
      {data.map((item: any, index: number) => (
        <div
          className={`${
            item.failoverStatus === "active"
              ? "sol_box_p10_deeplight sol_sum_card"
              : "sol_box_p10 sol_sum_card"
          }`}
          // onMouseEnter={() => setHoveredIndex(index)}
          // onMouseLeave={() => setHoveredIndex(null)}
          key={`${item.index}` + `${item.url}`}
        >
          <h6>
            {item.haRoleCode === "MON"
              ? "Monitor"
              : item.haRoleCode === "PRI"
              ? "Primary"
              : item.haRoleCode === "SEC"
              ? "Secondary"
              : ""}{" "}
            :
            <span
              className={` ${
                item.status === "ON" ? "sol_tit" : "sol_color_point"
              }`}
            >
              &nbsp;{item.status}
            </span>
          </h6>
          <div
            className="btn-group"
            // onClick={(event) => handleMenuClick(event, item, index)}
          >
            <a
              className="btn hstack btn-icon sol_btn_hamburger disabled"
              data-bs-toggle="dropdown"
            >
              <i className="sol_i_hamburger" />
            </a>
          </div>
          <div className="mt-2">
            <ul className="sol_card_list">
              <li>
                <span className="sol_data">{item.msnId}</span>
              </li>
              <li>
                <span className="sol_data">{item.url}</span>
              </li>
              <li>
                <span className="sol_data">{item.port}</span>
              </li>
            </ul>
          </div>

          {openModal === index ||
            (hoveredIndex === index && (
              <div className="sol_sum_card_ly">
                {ConfigStatusData.map((item) => (
                  <ul
                    className="sol_card_list"
                    key={item.id}
                    // onClick={(event) => {
                    //   event.stopPropagation();
                    //   handleActionTitleClick(actionItem);
                    // }}
                  >
                    <li>
                      {item.title} :
                      <span
                        className={` ${
                          item.value === "OFF"
                            ? `sol_color_red`
                            : "ON"
                            ? ``
                            : "sol_color_green"
                        }`}
                      >
                        &nbsp; {item.value}
                      </span>
                    </li>
                  </ul>
                ))}
              </div>
            ))}

          {item.failoverStatus === "active" ? (
            <span className="badge_active">Active</span>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default ConfigBox;

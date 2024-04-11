import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface SideBarProps {
  selectedTipId: number;
  data: any[];
  top: number;
  bottom: number;
}

// top: 200 , bottom: 80
// top: 150 , bottom: 20

const TipsSideBar: React.FC<SideBarProps> = ({
  selectedTipId,
  data,
  top,
  bottom,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const topDistanceFromTop = top;
  const sidebarStyles: React.CSSProperties = {
    position: "fixed",
    top: topDistanceFromTop - 10,
    bottom: 50,
    right: isOpen ? 20 : -310,
    width: 310,
    height: "calc(100% - " + (topDistanceFromTop + bottom) + "px)",
    backgroundColor: "transparent",
    // backgroundColor: "#2f3032",
    // borderRight: "1px solid #6b6b6b",
    // borderLeft: "1px solid #2f3032",
    transition: "right 0.5s ease-in-out",
    zIndex: 999,
    overflowY: "auto",
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const fnMoreLink = (link: any) => {
    router.push(link);
  };

  return (
    <div>
      <div
        className="sol_a_tip"
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          transition: "right 0.5s ease-in-out",
          top: topDistanceFromTop - 40,
          right: isOpen ? 285 : 25,
          zIndex: 1000,
          cursor: "pointer",
        }}
      >
        {isOpen === false && <i className="sol_i_tiparr sol_mr_6" />}
        Tips
        {isOpen && (
          <i
            className="sol_i_tiparr sol_ml_6"
            style={{ transform: "rotate(180deg)" }}
          />
        )}
      </div>
      <div style={sidebarStyles}>
        <ul
          style={{
            listStyleType: "none",
            padding: 5,
          }}
        >
          {data &&
            data
              .filter((tip) => tip.id === selectedTipId)
              .map((tip) => (
                <div key={tip.id} className="mt-3 sol_tip_text">
                  <div className="sol_tip_header">{tip.tips_header}</div>
                  <div className="sol_tip_body">{tip.tip_body}</div>
                  {/* -- sub -- */}
                  {tip.tip_sub && (
                    <>
                      <div className="mt-3 sol_tip_body">
                        {tip.tip_sub.map((item: any) => (
                          <>
                            <p style={{ textDecoration: "underline" }}>
                              {item.header}
                            </p>
                            <p>{item.body}</p>
                          </>
                        ))}
                      </div>
                    </>
                  )}
                  {/* -- more -- */}
                  {tip.moreYn === "Y" && (
                    <button
                      type="button"
                      className="btn btn-xs btn-outline-light"
                      onClick={() => fnMoreLink(tip.moreLink)}
                    >
                      more
                    </button>
                  )}
                </div>
              ))}
        </ul>
      </div>
    </div>
  );
};

export default TipsSideBar;

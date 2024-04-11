"use client";

import { useAppDispatch } from "@/hook/hook";
import { closeAlert, openAlert } from "@/redux/slices/alert/alertSlice";
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";

type AlertState = "Information" | "Warning" | "Fail" | "Success";

interface AlertModalProps {
  title?: string;
  description: string;
  state: AlertState;
  show: boolean;
  cancelBtnShow: boolean;
  confirmBtnShow: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

interface AlertSpanProps {
  state: AlertState;
}

const alertClass = {
  Information: "sol_img_alert sol_img_alert_info",
  Warning: "sol_img_alert sol_img_alert_warning",
  Fail: "sol_img_alert sol_img_alert_fail",
  Success: "sol_img_alert sol_img_alert_success",
};

const AlertSpan: React.FC<AlertSpanProps> = ({ state }) => {
  const className = alertClass[state];
  return <span className={className} />;
};

const AlertModal: React.FC<AlertModalProps> = ({
  title,
  description,
  state,
  show,
  cancelBtnShow,
  confirmBtnShow,
  onConfirm,
  onCancel,
}) => {
  // const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = React.useState(show);

  console.log(isVisible);

  useEffect(() => {
    setIsVisible(show);
    if (show) {
      // dispatch(openAlert());
    } else {
      // dispatch(closeAlert());
    }
  }, [show]);

  const handleConfirm = () => {
    onConfirm();
    setIsVisible(false);
    // dispatch(closeAlert());
  };

  const handleCancel = () => {
    onCancel();
    setIsVisible(false);
    // dispatch(closeAlert());
  };

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 1);
  }, []);

  return (
    <div className={`modal_wrap ${!isVisible ? "d-none" : ""}`}>
      <div className="modal_wrapbox">
        <div className="modal-dialog">
          <div className="sol_message_content w-400px sol_ptb_40">
            <div className="sol_message_header text-center">
              <div className="img_alert text-center">
                <AlertSpan state={state} />
              </div>
              {/* <h4 className="sol_message_content_tit">{title || state}</h4> */}
            </div>
            <div className="sol_message_content text-center">
              <div className="sol_p_10">{description}</div>
            </div>
            <div className="sol_message_footer justify-content-center">
              <div className="d-flex flex-wrap gap-2">
                <button
                  className={`btn btn-md hstack btn-danger ${
                    !confirmBtnShow ? "d-none" : ""
                  }`}
                  onClick={handleConfirm}
                >
                  Confirm
                </button>
                <button
                  className={`btn btn-md hstack btn-light ${
                    !cancelBtnShow ? "d-none" : ""
                  }`}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const alertModal = (
  descVal: string,
  stateVal: AlertState,
  showVal: boolean,
  cancelBtn: boolean,
  confirmBtn: boolean,
  onConfirm: () => void,
  onCancel: () => void
) => {
  console.log(descVal);
  console.log(stateVal);
  console.log(showVal);
  console.log(cancelBtn);
  console.log(confirmBtn);

  <AlertModal
    description={descVal}
    state={stateVal}
    show={showVal}
    cancelBtnShow={cancelBtn}
    confirmBtnShow={confirmBtn}
    onConfirm={onConfirm}
    onCancel={onCancel}
  />;

  // const handleConfirm = () => {
  //   const modalRoot = document.getElementById("modal-alert-portal-wrapper");
  //   if (modalRoot) modalRoot.remove();
  // };

  // if (typeof window !== "undefined") {
  //   const subDiv = document.createElement("div");
  //   subDiv.id = "modal-alert-portal-wrapper";
  //   document.body.appendChild(subDiv);

  //   const root = createRoot(subDiv);
  //   root.render(
  //     <AlertModal
  //       description={descVal}
  //       state={stateVal}
  //       show={showVal}
  //       cancelBtnShow={cancelBtn}
  //       confirmBtnShow={confirmBtn}
  //       onConfirm={handleConfirm}
  //       onCancel={onCancel}
  //     />
  //   );
  // }
};

export default alertModal;

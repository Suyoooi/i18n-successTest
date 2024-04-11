'use client';

import { useAppDispatch } from '@/hook/hook';
import { closeAlert, openAlert } from '@/redux/slices/alert/alertSlice';
import React, { useEffect } from 'react';

type AlertState = 'Information' | 'Warning' | 'Fail' | 'Success';

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
  Information: 'sol_img_alert sol_img_alert_info',
  Warning: 'sol_img_alert sol_img_alert_warning',
  Fail: 'sol_img_alert sol_img_alert_fail',
  Success: 'sol_img_alert sol_img_alert_success'
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
  onCancel
}) => {
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = React.useState(show);

  useEffect(() => {
    setIsVisible(show);
    if (show) {
      dispatch(openAlert());
    } else {
      dispatch(closeAlert());
    }
  }, [show]);

  const handleConfirm = () => {
    onConfirm();
    setIsVisible(false);
    dispatch(closeAlert());
  };

  const handleCancel = () => {
    onCancel();
    setIsVisible(false);
    dispatch(closeAlert());
  };

  return (
    <div className={`modal_wrap ${!isVisible ? 'd-none' : ''}`}>
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
                    !confirmBtnShow ? 'd-none' : ''
                  }`}
                  onClick={handleConfirm}>
                  Confirm
                </button>
                <button
                  className={`btn btn-md hstack btn-light ${
                    !cancelBtnShow ? 'd-none' : ''
                  }`}
                  onClick={handleCancel}>
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

export default AlertModal;

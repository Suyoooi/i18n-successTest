import React from "react";

interface ToggleSwitchProps {
  label: string;
  isEnabled: boolean;
  toggleId: string;
  onToggle: () => void;
  isEdit?: boolean;
  tipNo: number;
  onTitleClick: (tipNum: number) => void;
  depthNo?: number;
}

const Toggle: React.FC<ToggleSwitchProps> = ({
  label,
  isEnabled,
  toggleId,
  onToggle,
  isEdit,
  tipNo,
  onTitleClick,
  depthNo,
}) => {
  const handleTitleClick = () => {
    onTitleClick(tipNo);
  };

  const handleToggleChange = () => {
    // if (isEdit) {
    onToggle();
    // }
  };

  const getLabelClassName = () => {
    switch (depthNo) {
      case 1:
        return "sol_ml_10";
      case 2:
        return "sol_ml_20";
      case 3:
        return "sol_ml_30";
      default:
        return "";
    }
  };

  return (
    <div className="row col-md-8 align-items-center">
      <label className="col-sm-5 col-form-label" onClick={handleTitleClick}>
        <span className={getLabelClassName()}>{label}</span>
      </label>
      <div className="col-sm-7 col-form-label">
        <div className="form-check form-switch">
          <input
            id={toggleId}
            className="form-check-input"
            type="checkbox"
            checked={isEnabled}
            onChange={handleToggleChange}
            disabled={!isEdit}
          />
        </div>
      </div>
    </div>
  );
};
export default Toggle;

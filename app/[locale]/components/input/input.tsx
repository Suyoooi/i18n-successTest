"use client";

interface InputData {
  text: string;
  value: number;
  tipNo: number;
  depthNo?: number;
  onTitleClick: (tipNum: number) => void;
}

const Input: React.FC<InputData> = ({
  text,
  value,
  tipNo,
  onTitleClick,
  depthNo,
}) => {
  const handleTitleClick = () => {
    onTitleClick(tipNo);
  };

  // depth
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
    <>
      <div
        className="row col-md-8 align-items-center"
        style={{ display: value === undefined ? "none" : undefined }}
      >
        <label
          className="col-sm-5 col-form-label"
          htmlFor="set_maximummtransacted"
          onClick={handleTitleClick}
        >
          <span className={getLabelClassName()}>{text}</span>
        </label>
        <div className="col-sm-7 col-form-label">
          <input
            type="text"
            value={value}
            // onChange={handleValueChange}
            className="form-control sol_w300"
            // disabled={!isEdit}
            disabled={true}
          />
        </div>
      </div>
    </>
  );
};

export default Input;

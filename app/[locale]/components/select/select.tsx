"use client";

interface InputData {
  text: string;
  value: number;
  tipNo: number;
  depthNo?: number;
  onTitleClick: (tipNum: number) => void;
}

const Select: React.FC<InputData> = ({
  text,
  value,
  tipNo,
  onTitleClick,
  depthNo,
}) => {
  const handleTitleClick = () => {
    onTitleClick(tipNo);
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
          <select
            className="form-select sol_w300"
            value={value}
            // onChange={handleValueChange}
            // disabled={!isEdit}
            disabled={true}
          >
            <option value={"no publishing"}>no publishing</option>
            <option value={"publishing in format v1"}>
              publishing in format v1
            </option>
            <option value={"format v1, no unsubscribe"}>
              publishing in format v1, no unsubscribe events on disconnect
            </option>
            <option value={"publishing in format v2"}>
              publishing in format v2
            </option>
            <option value={"format v2, no unsubscribe"}>
              publishing in format v2, no unsubscribe events on disconnect
            </option>
          </select>
        </div>
      </div>
    </>
  );
};

export default Select;

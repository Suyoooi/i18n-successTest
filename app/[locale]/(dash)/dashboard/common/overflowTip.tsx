import React, { useRef, useEffect, useState } from "react";

interface CellProp {
  info: any;
  textAlign: any;
}

const OverflowTip = (props: CellProp) => {
  // Create Ref
  const textElementRef = useRef<HTMLDivElement>(null);
  // Define state and function to update the value
  const [hoverStatus, setHover] = useState(false);

  const compareSize = () => {
    const compare =
      (textElementRef?.current?.scrollWidth ?? 0) >
      (textElementRef?.current?.clientWidth ?? 0);
    if (compare !== hoverStatus) setHover(compare);
  };

  // compare once and add resize listener on "componentDidMount"
  useEffect(() => {
    compareSize();
    window.addEventListener("resize", compareSize);

    // remove resize listener again on "componentWillUnmount"
    return () => {
      window.removeEventListener("resize", compareSize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <div className="grow-col-rel-area">
        <div
          className="grow-col-abs-area"
          style={{ textAlign: props.textAlign }}
          ref={textElementRef}
        >
          <span
            data-tooltip-id={hoverStatus ? "table-tooltip-id" : undefined}
            data-tooltip-content={props.info.getValue()}
          >
            {props.info.getValue()}
          </span>
        </div>
      </div>
    </React.Fragment>
  );
};

export default OverflowTip;

"use client";
import React from "react";

interface BoxProps {
  children: React.ReactNode;
  // isZoomed: boolean;
  // setIsZoomed: React.Dispatch<React.SetStateAction<boolean>>;
}

const BoxComponent: React.FC<BoxProps> = ({
  children,
  // isZoomed,
  // setIsZoomed,
}) => {
  // const handleZoom = () => {
  //   setIsZoomed(!isZoomed);
  //   console.log(" 줌 했음 ", isZoomed);
  // };

  return (
    <div className="border-slate-500 border-2 bg-red-100 p-4 rounded-xl">
      <div>{children}</div>
      {/* <button
          style={{
            width: 20,
            marginRight: 10,
          }}
          onClick={handleZoom}
        >
          {isZoomed ? (
            <img src="/zoom_out.png" alt="ZoomOut" />
          ) : (
            <img src="/zoom.png" alt="Zoom" />
          )}
        </button> */}
    </div>
  );
};

export default BoxComponent;

"use client";

import { useAppSelector } from "@/hook/hook";

const VpnState = () => {
  const selectedRow = useAppSelector((state) => state.isVpn.selectedRow);

  return (
    <>{selectedRow && <div>{selectedRow ? selectedRow.msgVpnName : ""}</div>}</>
  );
};

export default VpnState;

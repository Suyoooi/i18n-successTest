import { useState } from "react";
import { formatDateTime } from "../utils/dateTimeFormat";

const useRefreshData = (initialDateTime: any) => {
  const [refreshTime, setRefreshTime] = useState(initialDateTime);

  const refreshData = () => {
    setRefreshTime(formatDateTime(new Date()));
  };

  return { refreshTime, refreshData };
};

export default useRefreshData;

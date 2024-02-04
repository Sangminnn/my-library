import React, { createContext, useContext, useEffect } from "react";

import useLog from "@hooks/useLog";
import { Log } from "@models/interfaces/log";
import useDeepMemo from "@hooks/useDeepMemo";

interface LogParamsContext {
  params: Pick<Log, "page_id" | "page_label">;
  useVisitLog?: boolean;
  children: React.ReactNode;
}

const LogParamsContext = createContext<Log | null>(null);

export const useLogParams = () => {
  const context = useContext(LogParamsContext);

  if (!context) {
    throw new Error("useLogParams는 LogParamsProvider 하위에 있어야합니다.");
  }
  return context;
};

const LogScreen = ({
  params,
  useVisitLog = false,
  children,
}: LogParamsContext) => {
  const { onVisitLog } = useLog();
  const value = useDeepMemo(params);

  useEffect(() => {
    if (!useVisitLog) return;

    onVisitLog(value);
  }, [value, useVisitLog]);

  return (
    <LogParamsContext.Provider value={value}>
      {children}
    </LogParamsContext.Provider>
  );
};

export default LogScreen;

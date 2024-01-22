import React from "react";

import React, { createContext, useContext } from "react";

interface LogParamsContext {
  params: Log;
  children: React.ReactNode;
}

const LogParamsContext = createContext<Log | null>(null);

export function useLogParams() {
  const context = useContext(LogParamsContext);
  if (context === undefined) {
    throw new Error("useLogParams는 LogParamsProvider 하위에 있어야합니다.");
  }
  return context;
}

const LogParamsProvider = ({ params, children }: LogParamsContext) => {
  return (
    <LogParamsContext.Provider value={params}>
      {children}
    </LogParamsContext.Provider>
  );
};

type LoggingType = "select" | "custom";

interface Props {
  loggingType: LoggingType;
  params: any;
  children: React.ReactElement;
}
export default function LoggingClick({ loggingType, params, children }: Props) {
  const child = React.Children.only(children);

  const onClickWithLogging = (...args: any[]) => {
    if (child.props && typeof child.props["onClick"] === "function") {
      // logger action
      child.props["onClick"](...args);
    }
  };

  return React.cloneElement(child, {
    onClick: onClickWithLogging,
  });
}

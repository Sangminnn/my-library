import React from "react";

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

import React, { ReactElement, useState } from "react";

import { debounce } from "lodash-es";

interface Props {
  wait?: number;
  capture?: string;
  children: ReactElement;
}

/**
 * @description 1회 호출시에는 바로 실행하고, 이후부터는 debounce를 적용
 * click은 Discrete Event로 Syne Lane을 거쳐 빠른 속도로 이벤트가 실행되더라도 동기적 실행(Render Phase, Commit Phase)을 통해 전환을 보장한다.
 */
export default function DebounceClick({
  capture = "onClick",
  wait = 400,
  children,
}: Props) {
  const [firstClick, setFirstClick] = useState(true);
  const child = React.Children.only(children);

  const debouncedEvent = debounce((...args: any[]) => {
    if (child.props && typeof child.props[capture] === "function") {
      child.props[capture](...args);
    }
  }, wait);

  const handleClick = (...args: any[]) => {
    if (firstClick) {
      setFirstClick(false);
      if (child.props && typeof child.props[capture] === "function") {
        child.props[capture](...args);
      }
    } else debouncedEvent(...args);
  };

  return React.cloneElement(child, {
    [capture]: handleClick,
  });
}

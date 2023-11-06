import React, { useState, useEffect, useCallback, useRef } from "react";

import styled from "styled-components";

import {
  useFloating,
  offset,
  arrow,
  autoUpdate,
  FloatingArrow,
} from "@floating-ui/react";

interface TooltipProps {
  defaultOpen?: boolean;
  children: React.ReactElement;
  content?: string | React.ReactNode;
  onClick?: (e?: any) => void;
  callOnce?: boolean;
  time?: number;
  placement: "left" | "right" | "top" | "bottom";
  space?: number;
  tooltipStyle?: React.CSSProperties;
  closeWhenOtherPlaceClick?: boolean;
}

/**
 * @description 공통으로 사용하기위한 Tooltip 컴포넌트입니다.
 *
 * @params defaultOpen: 첫 렌더시에 open되어있는 상태를 표현하고자 할때 사용합니다.
 * @params content: Tooltip 내부에 나타날 문구를 정합니다.
 * @params callOnce: on/off할 수 있는것이 아닌 한번만 동작하게 하고싶을때 사용합니다.
 * @params time: Tooltip이 일정시간 이후 자동으로 off될 수 있도록 하고싶을때 사용합니다.
 * @params placement: Trigger를 기준으로 Tooltip이 위치할 장소를 정합니다.
 * @params closeWhenOtherPlaceClick: 툴팁 외 지면을 클릭할 경우 툴팁이 사라질지에 대한 여부입니다.
 *
 * @tip defaultOpen과 callOnce가 각각 false, true라면 툴팁이 동작하지 않게할 수 있습니다.
 */
const Tooltip = ({
  defaultOpen = false,
  children,
  content,
  onClick,
  callOnce = false,
  time,
  placement = "bottom",
  space = 7,
  tooltipStyle,
  closeWhenOtherPlaceClick = true,
}: TooltipProps) => {
  const [isShow, setIsShow] = useState(defaultOpen);

  const arrowRef = useRef(null);
  const { x, y, strategy, refs, context } = useFloating({
    placement,
    middleware: [
      offset(space),
      arrow({
        element: arrowRef,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    setIsShow(defaultOpen);
  }, [defaultOpen]);

  useEffect(() => {
    if (time && isShow) {
      setTimeout(() => {
        setIsShow(false);
      }, time);
    }
  }, [time, isShow]);

  useEffect(() => {
    window.addEventListener("click", closeWhenOtherPlaceClicked);

    return () =>
      window.removeEventListener("click", closeWhenOtherPlaceClicked);
  }, []);

  const closeWhenOtherPlaceClicked = useCallback(() => {
    if (!closeWhenOtherPlaceClick) return;
    if (!!isShow) setIsShow(false);
  }, [isShow]);

  const clickTooltip = useCallback(
    (e) => {
      onClick?.();
      if (!!callOnce) return;

      e.stopPropagation();
      setIsShow(!isShow);
    },
    [isShow]
  );

  const triggerComponent = React.cloneElement(children, {
    ref: refs.setReference,
    onClick: clickTooltip,
  });

  const arrowColor = tooltipStyle?.backgroundColor
    ? tooltipStyle?.backgroundColor
    : "#666666";

  return (
    <>
      {triggerComponent}
      {isShow && (
        <div
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
        >
          <FloatingArrow
            ref={arrowRef}
            context={context}
            width={12}
            height={5}
            fill={arrowColor}
          />
          <TooltipBody style={tooltipStyle}>{content}</TooltipBody>
        </div>
      )}
    </>
  );
};

export default Tooltip;

const TooltipBody = styled.div`
  position: relative;
  width: max-content;
  max-width: 250px;
  border-radius: 6px;
  background-color: #666666;
  color: #fff;
  padding: 10px 12px;
  text-align: center;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.4;
  white-space: pre-wrap;
`;

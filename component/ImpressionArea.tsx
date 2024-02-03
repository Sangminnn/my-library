import React, { useEffect, useMemo, useRef } from "react";

/**
 * @description 특정 영역이 Viewport에 나타나면 이벤트를 실행시키기 위한 컴포넌트입니다.
 *
 * @param onImpressionStart 영역이 Viewport에 나타나면 실행시킬 이벤트입니다.
 * @param style 감싸고있는 div에 스타일링이 필요할 경우 넣어줍니다.
 * @param options intersection observer의 Option을 넣어줍니다.
 * @param callOnce 해당 이벤트를 한번만 실행할지에 대한 여부입니다. (기본값 true)
 */
export default function ImpressionArea({
  onImpressionStart,
  style,
  options,
  callOnce = true,
  children,
}: {
  onImpressionStart?: <T>(value?: T) => void;
  style?: React.CSSProperties;
  options?: IntersectionObserverInit;
  callOnce?: boolean;
  children: React.ReactNode;
}) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!targetRef.current) return;
    const target = targetRef.current;

    const observer = new IntersectionObserver(([entry], currentObserver) => {
      if (!entry?.isIntersecting) {
        return;
      }

      onImpressionStart?.();

      if (targetRef.current && callOnce) {
        currentObserver.unobserve(targetRef.current);
      }
    }, options);

    observer?.observe(target);

    return () => {
      observer?.disconnect();
    };
  }, [options]);

  return (
    <div ref={targetRef} style={style}>
      {children}
    </div>
  );
}

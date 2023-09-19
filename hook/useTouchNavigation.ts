import { useEffect, useCallback, useRef, useState } from "react";

/**
 * @params navigationTargetDataList - navigate할 대상이 담긴 데이터를 넣어줍니다.
 * @params elementHeight - navigation에 존재하는 anchor 엘리먼트의 높이를 넣어줍니다.
 * @params elementSpace - navigation에 존재하는 anchor 엘리먼트 사이의 간격을 넣어줍니다.
 *
 * @returns scrollLockStatus - scrollLock 상태를 반환
 * @returns moveTargetRef - navigation을 누를 시 타겟으로 이동합니다.
 * @returns anchorListRef - 앵커링이 걸리는 대상 리스트 Ref
 * @returns navigationRef - navigation 역할을 하는 대상 Ref
 * @returns navigationFirstElementRef - navigation의 첫번째 element
 *
 */

export default function useTouchNavigation({
  navigationTargetDataList,
  elementHeight,
  elementSpace,
}: {
  navigationTargetDataList?: any[];
  elementHeight: number;
  elementSpace: number;
}) {
  const [isScrollLock, setIsScrollLock] = useState(false);

  const navigationRef = useRef<HTMLDivElement>(null);
  const navigationFirstElementRef = useRef<HTMLDivElement>(null);

  const anchorListRef = useRef<HTMLDivElement[]>([]);
  const anchorPositionList = useRef<number[]>([]);

  const setRefOriginPosition = useCallback(() => {
    const anchorList = anchorListRef.current;
    if (!anchorList) return;

    window.scroll(0, 0);
    anchorPositionList.current = anchorList.map((anchor) => {
      return anchor.offsetTop;
    });
  }, [anchorListRef]);

  const moveTargetRef = (index: number) => {
    const targetOffsetTop = anchorPositionList.current[index];
    window.scrollTo(0, targetOffsetTop);
  };

  const handleTouchStart = useCallback(() => {
    setIsScrollLock(true);
  }, []);

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      const firstRef =
        navigationFirstElementRef?.current?.getBoundingClientRect().top;

      if (!firstRef || !navigationTargetDataList) return;

      const BREAK_POINT = navigationTargetDataList.map((_, index) => {
        return firstRef + (elementHeight + elementSpace) * index;
      });

      const TOUCHED_Y_POSITION = event.changedTouches[0].clientY;

      const isUnderBreakPointRange = TOUCHED_Y_POSITION < BREAK_POINT[0];

      if (isUnderBreakPointRange) return;

      const targetBreakPoint = BREAK_POINT.findIndex(
        (point) => point > TOUCHED_Y_POSITION
      );

      const isOverBreakPointRange = targetBreakPoint <= 0;

      if (targetBreakPoint === 1) {
        window.scrollTo(0, 0);
        return;
      }

      if (isOverBreakPointRange) {
        window.scrollTo(0, anchorPositionList.current[BREAK_POINT.length - 1]);
        return;
      }

      window.scrollTo(0, anchorPositionList.current[targetBreakPoint - 1]);
    },
    [navigationTargetDataList]
  );

  const handleTouchEnd = useCallback(() => {
    setIsScrollLock(false);
  }, []);

  useEffect(() => {
    setRefOriginPosition();
  }, [navigationTargetDataList]);

  useEffect(() => {
    if (!navigationRef.current) return;

    const navigation = navigationRef.current;

    navigation.addEventListener("touchstart", handleTouchStart);
    navigation.addEventListener("touchmove", handleTouchMove);
    navigation.addEventListener("touchend", handleTouchEnd);

    return () => {
      navigation.removeEventListener("touchstart", handleTouchStart);
      navigation.removeEventListener("touchmove", handleTouchMove);
      navigation.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return {
    scrollLockStatus: isScrollLock,
    moveTargetRef,
    anchorListRef,
    navigationRef,
    navigationFirstElementRef,
  };
}

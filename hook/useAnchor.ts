import React, { useEffect } from "react";

import { useIsFetching } from "react-query";

import qs from "query-string";
import { convertStringToNumber } from "@utils/common";

const useAnchor = <T extends HTMLDivElement>({
  targetRef,
  targetQuery,
  fixedSpace,
}: {
  targetRef: T;
  targetQuery?: number;
  fixedSpace: number;
}) => {
  const isQueryFetching = useIsFetching();

  const { slotId: targetSlotId } = qs.parse(location.search);
  useEffect(() => {
    if (!targetRef || isQueryFetching > 0) return;

    const scrollTargetSlot = convertStringToNumber(targetSlotId as string);

    const isTargetSlot = scrollTargetSlot === targetQuery;

    if (!isTargetSlot) return;

    requestAnimationFrame(() => {
      if (!targetRef) return;
      window.scrollTo(0, targetRef.offsetTop - fixedSpace);
    });
  }, [targetRef, targetQuery, targetSlotId, isQueryFetching, fixedSpace]);
};

export default useAnchor;

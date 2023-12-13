import React, { useEffect, useRef } from "react";
import compare from "react-fast-compare";

// next와 이전에 받아온 값인 prevRef를 비교해서, 변경되었다면 next를 아니라면 prev를 반환해준다.
// 출처 : stackflow utils
const useMemoDeep = (next) => {
  const prevRef = useRef(null);
  const prevValue = prevRef.current;

  const isEqual = compare(prevValue, next);

  useEffect(() => {
    if (!isEqual) {
      prevRef.current = next;
    }
  }, [next]);

  return isEqual ? prevValue : next;
};

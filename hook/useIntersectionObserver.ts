import { useEffect, useRef } from "react";
import { usePreservedCallback } from "./usePreservedCallback";

import { noop } from "lodash";

interface IntersectionObserverProps {
  onIntersectStart?: () => void;
  onIntersectEnd?: () => void;
  options?: IntersectionObserverInit & {
    callOnce?: boolean;
  };
}

const useIntersectionObserver = ({
  onIntersectStart = noop,
  onIntersectEnd = noop,
  options = {
    callOnce: false,
  },
}: IntersectionObserverProps) => {
  const targetRef = useRef(null);
  const previousIntersect = useRef(false);

  const onStart = usePreservedCallback(onIntersectStart);
  const onEnd = usePreservedCallback(onIntersectEnd);

  const { callOnce, ...observerOptions } = options;

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;

      const isIntersectingStart = entry.isIntersecting;
      const isIntersectingEnd =
        previousIntersect.current && !entry.isIntersecting;

      if (isIntersectingStart) {
        onStart();
        if (callOnce) {
          observer.unobserve(target);
        }
      }

      if (isIntersectingEnd) {
        onEnd();
        if (callOnce) {
          observer.unobserve(target);
        }
      }

      previousIntersect.current = entry.isIntersecting;
    }, observerOptions);

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [onStart, onEnd, callOnce, observerOptions]);

  return { targetRef };
};

export default useIntersectionObserver;

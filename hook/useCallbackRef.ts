import { useEffect, useRef } from "react";

const useCallbackRef = (originCallback) => {
  const cleanupRef = useRef(null);

  const callback = useCallback(
    (node) => {
      if (!!cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      if (node) {
        cleanupRef.current = originCallback(node);
      }
    },
    [originCallback]
  );

  return callback;
};

export default useCallbackRef;

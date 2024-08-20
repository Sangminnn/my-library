import { useLayoutEffect, useRef, useState } from "react";

type Nullable<T> = T | null;

type ElementDimensions = {
  offsetWidth: number;
  offsetHeight: number;
  clientWidth: number;
  clientHeight: number;
  scrollWidth: number;
  scrollHeight: number;
  offsetLeft: number;
  offsetTop: number;
};

type ElementDimensionsKeys = keyof ElementDimensions;

function useElementDimensions<
  T extends HTMLElement,
  K extends ElementDimensionsKeys = ElementDimensionsKeys,
>(...keys: K[]) {
  const ref = useRef<T>(null);
  const [dimensions, setDimensions] =
    useState<Nullable<Pick<ElementDimensions, K>>>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (element == null) {
      return;
    }

    const dimensionData = {} as Pick<ElementDimensions, K>;

    for (const key of keys) {
      dimensionData[key] = element[key];
    }

    setDimensions(dimensionData);
  }, [keys]);

  return { ref, dimensions };
}

export default useElementDimensions;

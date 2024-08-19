import { useEffect, useRef, useState } from "react";

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

type Values<T> = T[keyof T];
type ElementDimensionsKeys = keyof ElementDimensions;
type Dimensions<T extends ElementDimensionsKeys[]> = {
  [K in T[number]]: ElementDimensions[K];
};

function useElementDimensions<T extends ElementDimensionsKeys[]>(...keys: T) {
  const ref = useRef<HTMLElement>(null);
  const [dimensions, setDimensions] = useState<Nullable<Dimensions<T>>>(null);

  useEffect(() => {
    const element = ref.current;
    if (element == null) {
      return;
    }

    const dimensionData = {} as { [K in T[number]]: ElementDimensions[K] };

    for (const key of keys) {
      dimensionData[key as T[number]] = element[
        key
      ] as Values<ElementDimensions>;
    }

    setDimensions(dimensionData);
  }, [keys]);

  return { ref, dimensions };
}

export default useElementDimensions;

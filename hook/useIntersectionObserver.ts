import { useEffect, useRef, useCallback } from "react";

interface CustomIntersectionObserverInit extends IntersectionObserverInit {
  // manual
  manual?: boolean;
}

interface Props {
  action: any;
  options: CustomIntersectionObserverInit;
}

const useIntersectionObserver = ({ action, options }: Props) => {
  const { manual = false, ...originOptions } = options;
  // 배열안에서 값 하나를 선택하고싶은 상황에서는 [target] 처럼 풀어낼 수 있다.
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry) return;

    // slash에서는 제어역전을 통해 사용처에서 entry를 받고, 이 값에 맞게 세팅할 수 있도록 한듯
    if (manual) {
      action(entry);
    } else {
      if (!entry.isIntersecting) return;

      action();
    }
  }, originOptions);

  // 하려고했던것은 특정 조건에서는 action이 동작하지 않게, 즉 observing을 그만하게 하고싶음

  const ref = useCallback(
    (element) => {
      observer.observe(element);

      // 이 부분에서 어떻게 unobserve해줄지 고민
    },
    [action, options]
  );
  // 반환해야하는것은 ref, ref를 observing target에 주입하여 정확하게 동작할 수 있도록한다.

  return ref;
};

export default useIntersectionObserver;

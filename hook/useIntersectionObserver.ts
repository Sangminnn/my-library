import { useEffect, useRef, useCallback } from "react";

interface CustomIntersectionObserverInit extends IntersectionObserverInit {
  // manual
  manual?: boolean;
  callOnce?: boolean;
}

interface Props {
  action: any;
  options: CustomIntersectionObserverInit;
}

// 예외 케이스 정리
// 1. disconnect하지 않는 케이스가 존재할지
// 2. observerRef에 쌓여있는 대상 Ref들을 누적해야하는 일이 있는지?

/**
 * 현재 정리한 스펙
 * 1. observe의 특정 동작이 있으면 좋을듯
 *  1-1. callOnce - 한번 실행 후 unobserve해준다.
 *  1-2. manual - 제어권을 호출부로 넘겨준다.
 *
 * 2. observer안에서 특정 node를 unobserve하는 것
 *  1-1로부터 파생되었으며, 이렇게 수행할 수 있는 방법은 observerRef와 bridgeRef를 두어 bridge를 통해 제공받는것으로 보임
 */

const useIntersectionObserver = ({ action, options }: Props) => {
  const { manual = false, callOnce = false, ...originOptions } = options;

  const observerRef = useRef(null);

  const bridgeRef = useCallback((node) => {
    // 재연결된것이라면 clear가 필요한지
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;

      // slash에서는 제어역전을 통해 사용처에서 entry를 받고, 이 값에 맞게 세팅할 수 있도록 한듯

      // observer입장에서는 unobserve가 불가능하다.
      // 함수형태로 전달받는 방법밖에 없고, 이를 실현하기 위해 ref와 useCallback을 조합하는것으로 보임.
      // 따라서 observer역할을 하는 ref를 대신두고, 브릿지용 함수ref를 만들어 제공, 및 주입하는 방식을 통해
      // observer ref를 상황에 따라 핸들링할 수 있도록 한다.
      const callOnceAction = (targetNode) => {
        if (!observerRef.current) return;

        action?.();
        observerRef.current.observe(targetNode);
      };

      if (!entry.isIntersecting) return;

      const callAction = entry.isIntersecting && !manual;
      const callManualAction = entry.isIntersecting && manual;

      if (callAction) {
        callOnce ? callOnceAction(node) : action();
      } else if (callManualAction) {
        action(entry);
      }
    }, originOptions);

    // 여기서 node가 있으면 observe 달아준다.
    if (node) observerRef.current.observe(node);
  }, []);

  // 배열안에서 값 하나를 선택하고싶은 상황에서는 [target] 처럼 풀어낼 수 있다.

  // 반환해야하는것은 ref, ref를 observing target에 주입하여 정확하게 동작할 수 있도록한다.
  // ref를 지역적으로 다루게된다면, callOnce와 같이 한번 실행하려고하는 부분에서는 제어가 어렵다. (action부에서 접근이 불가능하기때문)

  return bridgeRef;
};

export default useIntersectionObserver;

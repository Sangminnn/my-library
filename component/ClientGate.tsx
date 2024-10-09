import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

// from: https://tkdodo.eu/blog/avoiding-hydration-mismatches-with-use-sync-external-store
/**
 * @description useEffect를 사용하여 서버를 체크하는 경우에는 렌더링 사이클동안 null을 유지하다가 변경되지만
 * useSyncExternalStore를 활용하면 CSR렌더링이라면 렌더링 사이클을 기다리지 않고 최초 렌더시점부터 초기값을 가지고 시작할 수 있다.
 */
export function ClientGate({ children }) {
  const isServer = useSyncExternalStore(
    emptySubscribe,
    () => false,
    () => true
  );

  return isServer ? null : children();
}

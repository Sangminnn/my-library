// useHistoryStack.ts
import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useHistoryStack() {
  const navigate = useNavigate();
  const location = useLocation();
  const historyStackRef = useRef<string[]>([]);

  // 현재 경로 변경 시 스택 업데이트
  useEffect(() => {
    const currentPath = location.pathname;
    const stack = historyStackRef.current;

    // 뒤로가기 감지 (브라우저 뒤로가기 버튼 사용 시)
    if (stack.length > 0 && stack[stack.length - 1] !== currentPath) {
      if (stack.includes(currentPath)) {
        // 스택에 있는 경로로 돌아간 경우 (뒤로가기)
        const index = stack.lastIndexOf(currentPath);
        historyStackRef.current = stack.slice(0, index + 1);
      } else {
        // 새 경로로 이동한 경우
        historyStackRef.current.push(currentPath);
      }
    } else if (stack.length === 0) {
      // 초기 경로
      historyStackRef.current.push(currentPath);
    }
  }, [location.pathname]);

  // 새 경로 추가
  const push = useCallback(
    (path: string) => {
      historyStackRef.current.push(path);
      navigate(path);
    },
    [navigate]
  );

  // 현재 경로 교체
  const replace = useCallback(
    (path: string) => {
      const stack = historyStackRef.current;
      if (stack.length > 0) {
        stack[stack.length - 1] = path;
      } else {
        stack.push(path);
      }
      navigate(path, { replace: true });
    },
    [navigate]
  );

  // 뒤로가기
  const pop = useCallback(() => {
    const stack = historyStackRef.current;
    if (stack.length > 1) {
      stack.pop(); // 현재 경로 제거
      const previousPath = stack[stack.length - 1];
      navigate(previousPath);
    }
  }, [navigate]);

  // 스택 초기화 후 새 경로 설정
  const reset = useCallback(
    (path: string) => {
      historyStackRef.current = [path];
      navigate(path, { replace: true });
    },
    [navigate]
  );

  // 특정 경로까지 스택 초기화 (마지막으로 발견된 경로 사용)
  const resetToPath = useCallback(
    (path: string) => {
      const stack = historyStackRef.current;
      const index = stack.lastIndexOf(path); // 마지막으로 발견된 인덱스

      if (index !== -1) {
        historyStackRef.current = stack.slice(0, index + 1);
        navigate(path);
      } else {
        // 경로가 스택에 없으면 추가
        push(path);
      }
    },
    [navigate, push]
  );

  // 뒤로 갈 수 있는지 확인
  const canGoBack = useCallback(() => {
    return historyStackRef.current.length > 1;
  }, []);

  // 현재 스택 가져오기
  const getStack = useCallback(() => {
    return [...historyStackRef.current];
  }, []);

  return {
    push,
    replace,
    pop,
    reset,
    resetToPath,
    canGoBack,
    getStack,
  };
}

interface Options {
  signal?: AbortSignal;
}

export const delay = (ms: number, { signal }: Options) => {
  return new Promise((resolve, reject) => {
    const abortError = () => {
      reject(new Error("Aborted"));
    };

    const handleAbort = () => {
      clearTimeout(timeout);
      abortError();
    };

    // 이미 취소된 요청이라면 바로 에러를 반환
    if (signal?.aborted) {
      return abortError();
    }

    const timeout = setTimeout(resolve, ms);

    // 요청이 취소되었을 때 clearTimeout
    signal?.addEventListener("abort", handleAbort, { once: true });
  });
};

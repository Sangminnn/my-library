import { useState, useCallback, useRef, useEffect } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";

export function useHttpRequest<T, H = void>(
  dataFetchCallback: (payload?: H) => Promise<T>,
  initialValue?: T
) {
  const [loading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [fetchCount, setFetchCount] = useState(0);
  const [data, setData] = useState<T>(initialValue);
  const [errorData, setErrorData] = useState<AxiosError>();

  const cancelTokenSource = useRef(axios.CancelToken.source());

  const request = useCallback(
    async (
      payload?: H,
      callbacks?: CallbackFunctions<T>,
      isDataRefresh = false
    ) => {
      setLoading(true);
      if (isDataRefresh) setData(initialValue);
      setError(false);
      setErrorData(undefined);

      // 새로운 요청이 시작될 때마다 이전 요청 취소
      cancelTokenSource.current.cancel("Cancelled due to new request");
      cancelTokenSource.current = axios.CancelToken.source();

      const requestOptions: AxiosRequestConfig = {
        cancelToken: cancelTokenSource.current.token,
      };

      try {
        const data = await dataFetchCallback(payload, requestOptions);
        setData(data);
        setSuccess(true);
        callbacks?.onSuccess?.(data);
      } catch (e) {
        if (axios.isCancel(e)) {
          console.log("Request cancelled:", e.message);
        } else {
          const error = e as AxiosError;
          setSuccess(false);
          setError(true);
          setErrorData(error);
          callbacks?.onError?.(error) || console.error(error);
          throw error;
        }
      } finally {
        if (!axios.isCancel(e)) {
          setLoading(false);
          setFetchCount((current) => current + 1);
          callbacks?.onFinished?.();
        }
      }
    },
    [dataFetchCallback, initialValue]
  );

  // 컴포넌트 언마운트 시 모든 진행 중인 요청 취소
  useEffect(() => {
    return () => {
      cancelTokenSource.current.cancel("Cancelled due to component unmounting");
    };
  }, []);

  return [
    data,
    request,
    loading,
    isSuccess,
    isError,
    setData,
    errorData,
    fetchCount,
  ];
}

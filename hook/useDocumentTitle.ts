import { useRef, useEffect } from "react";

const useDocumentTitle = (title: string) => {
  const prevTitle = useRef("");

  useEffect(() => {
    const documentTitle = document.title;
    prevTitle.current = documentTitle;

    document.title = title;

    return () => {
      const prev = prevTitle.current;
      document.title = prev;
    };
  }, []);
};

export default useDocumentTitle;

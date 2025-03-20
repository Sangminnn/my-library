import { css } from "@emotion/react";
import { ReactNode, useEffect, useRef, useState } from "react";

import { useIsClient } from "@/hooks/useIsClient";

interface FoldedAreaProps {
  maxLines: number;
  expandElement: ReactNode;
  children: ReactNode;
}

const FoldedArea = ({ maxLines, expandElement, children }: FoldedAreaProps) => {
  const [isEllipsed, setIsEllipsed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [computedLineHeight, setComputedLineHeight] = useState("21px"); // 기본값

  const contentRef = useRef<HTMLDivElement>(null);
  const originalContentRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);

  const isClient = useIsClient();

  useEffect(() => {
    const checkNeedEllipsis = () => {
      if (!originalContentRef.current || !contentRef.current) return;

      const originalHeight = originalContentRef.current.clientHeight;
      const contentHeight = contentRef.current.clientHeight;
      setIsEllipsed(originalHeight > contentHeight);
    };

    const calculateLineHeight = () => {
      if (!childrenRef.current) return;

      const childElement = childrenRef.current.firstElementChild;
      if (!childElement) return;

      const style = window.getComputedStyle(childElement);
      const lineHeight = style.lineHeight;

      if (lineHeight === "normal") {
        const fontSize = parseFloat(style.fontSize);
        setComputedLineHeight(`${fontSize * 1.2}px`);
      } else {
        setComputedLineHeight(lineHeight);
      }
    };

    calculateLineHeight();
    checkNeedEllipsis();

    window.addEventListener("resize", checkNeedEllipsis);

    return () => {
      window.removeEventListener("resize", checkNeedEllipsis);
    };
  }, []);

  return (
    <div
      css={css`
        position: relative;
        width: 100%;
        visibility: ${isClient ? "visible" : "hidden"};
      `}
    >
      {isExpanded ? (
        <div>
          <div ref={childrenRef}>{children}</div>
        </div>
      ) : (
        <div
          css={css`
            position: relative;
          `}
        >
          <div
            ref={contentRef}
            css={css`
              overflow: hidden;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: ${maxLines};
            `}
          >
            {isEllipsed && (
              <div
                onClick={() => setIsExpanded(true)}
                css={css`
                  float: right;
                  margin-top: calc((${maxLines} - 1) * ${computedLineHeight});
                  shape-outside: border-box;
                `}
              >
                {expandElement}
              </div>
            )}
            <div ref={childrenRef}>{children}</div>
          </div>

          <div
            css={css`
              position: absolute;
              overflow: hidden;
              height: 0;
              visibility: hidden;
            `}
          >
            <div ref={originalContentRef}>{children}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export const More = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    css={css`
      cursor: pointer;
      color: inherit;
      background: none;
      border: none;
      padding: 0;
    `}
    {...props}
  />
);

export default FoldedArea;

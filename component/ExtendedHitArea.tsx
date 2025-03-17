import { forwardRef, ReactNode } from "react";

interface ExtendedHitAreaProps {
  children: ReactNode;
  padding?: number;
  onClick?: () => void;
}

const ExtendedHitArea = forwardRef<HTMLDivElement, ExtendedHitAreaProps>(
  ({ children, padding = 10, onClick }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          position: "relative",
          display: "inline-block",
        }}
        onClick={onClick}
      >
        <div
          style={{
            position: "absolute",
            top: `-${padding}px`,
            left: `-${padding}px`,
            right: `-${padding}px`,
            bottom: `-${padding}px`,
            pointerEvents: "auto",
            touchAction: "manipulation",
          }}
        />
        <div style={{ pointerEvents: "none" }}>{children}</div>
      </div>
    );
  }
);

ExtendedHitArea.displayName = "ExtendedHitArea";

export default ExtendedHitArea;

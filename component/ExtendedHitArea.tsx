import { Children, ReactElement, forwardRef } from "react";

interface ExtendedHitAreaProps {
  children: ReactElement;
  padding?: number;
  onClick?: (...args: any[]) => void;
}

const ExtendedHitArea = forwardRef<HTMLDivElement, ExtendedHitAreaProps>(
  ({ children, padding = 10, onClick }, ref) => {
    const childProps = Children.only(children).props;
    const onClickFromChild = childProps.onClick;

    const handleClick = (...args: any[]) => {
      if (onClickFromChild) {
        onClickFromChild(...args);
      }

      if (onClick) {
        onClick(...args);
      }
    };

    return (
      <div
        ref={ref}
        style={{
          position: "relative",
          display: "inline-block",
        }}
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
          onClick={handleClick}
        />
        <div style={{ pointerEvents: "none" }}>{children}</div>
      </div>
    );
  }
);

ExtendedHitArea.displayName = "ExtendedHitArea";

export default ExtendedHitArea;

import { PropsWithChildren, useEffect, useRef } from "react";
import Animate from "./Animate";

const RollingNumber = ({
  initial = true,
  value,
}: PropsWithChildren<{
  initial?: boolean;
  value: string | number;
}>) => {
  const prevCountRef = useRef<string | number>(0);

  useEffect(() => {
    prevCountRef.current = value;
  }, [value]);

  return (
    <>
      <Animate prevNumber={prevCountRef.current} currentNumber={value} />
    </>
  );
};

export default RollingNumber;

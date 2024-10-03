import React, { useEffect, useState } from "react";
import SwitchCase from "./SwitchCase";
import Spacing from "./Spacing";

interface ABTestProps {
  condition: boolean;
  trueCase: JSX.Element;
  falseCase: JSX.Element;
  fallbackCase?: JSX.Element;
}

/** @description fallbackCase의 경우 A, B 값의 계산동안 시간이 걸릴 때 보여주고있을 UI를 지정함 */
const ABTest = ({
  condition,
  trueCase,
  falseCase,
  fallbackCase = <Spacing height={500} />,
}: ABTestProps) => {
  const [userCase, setUserCase] = useState<"A" | "B" | "Loading">("Loading");

  useEffect(() => {
    setUserCase(condition ? "A" : "B");
  }, [condition]);

  return (
    <SwitchCase
      caseBy={{
        A: trueCase,
        B: falseCase,
        Loading: fallbackCase,
      }}
      value={userCase}
    />
  );
};

export default ABTest;

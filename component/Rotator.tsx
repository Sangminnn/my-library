import React, { useState, useLayoutEffect } from "react";

interface RotatorProps<T> {
  leftArea?: string | React.ReactNode;
  value?: T;
  onChange?: (value: T) => void;
  dataSet: {
    value: string;
    img: string;
  }[];
  style?: React.CSSProperties;
}

/**
 * @description 클릭하면 dataSet에 맞는 다음값에 대한 정보를 반환해줍니다.
 * @param leftArea (optional) 좌측에 컨텐츠를 두어 클릭 영역을 확대하고싶을때 사용합니다.
 * @param value (optional) 여러개의 Rotator를 동일지면에서 사용 및 값을 상위에서 Control할때 사용합니다.
 * @param onChange 클릭 시 선택된 값의 다음값을 상위로 올려줍니다.
 * @param dataSet value, img로 이루어진 array를 받습니다.
 * @param style image style을 override할때 사용합니다.
 */
export default function Rotator<T>({
  leftArea,
  value,
  onChange,
  dataSet,
  style,
}: RotatorProps<T>) {
  const [count, setCount] = useState(0);

  /** @description 최초로딩 시 paint된 후 변경되는 깜빡임이 나타나 LayoutEffect로 관리합니다. */
  useLayoutEffect(() => {
    const selectedIndex = dataSet.findIndex((data) => value === data.value);
    const isSelectedValueInDataSet = () => !!(selectedIndex >= 0);

    if (!isSelectedValueInDataSet()) return setCount(0);

    setCount(selectedIndex);
  }, [value]);

  const currentTargetIndex = count % dataSet?.length;

  const handleChange = () => {
    setCount((count) => count + 1);
    onChange?.(dataSet[(currentTargetIndex + 1) % dataSet.length]?.value as T);
  };

  return (
    <div onClick={handleChange}>
      {leftArea}
      <img style={style} src={dataSet[currentTargetIndex]?.img} />
    </div>
  );
}

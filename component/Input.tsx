// 출처 : https://fe-developers.kakaoent.com/2024/240116-common-component/
import { ChangeEvent, useState } from "react";

interface Props {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

// checked 속성에 따라 controlled component와 uncontrolled component를 구분하여 처리할 수 있도록 함.
export default function Checkbox({
  checked: controlledChecked,
  onChange,
}: Props) {
  const isControlled = controlledChecked !== undefined;
  const [checked, setChecked] = useState(false);

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const checked = ev.target.checked;

    if (!isControlled) {
      setChecked(checked);
    }

    onChange?.(checked);
  };

  return (
    <input
      type="checkbox"
      onChange={handleChange}
      checked={isControlled ? controlledChecked : checked}
    />
  );
}

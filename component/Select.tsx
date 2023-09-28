import React, {
  useState,
  useContext,
  createContext,
  PropsWithChildren,
} from "react";

export interface SelectProps {
  defaultValue?: string;
  value?: string;
  onChange?: (value: any) => void;
  defaultOpen?: boolean;
}

interface SelectContextProps extends SelectProps {
  isOpen: boolean;
  setOpen?: any;
}

interface SelectOptionProps {
  children: React.ReactNode | any;
}

interface ChipProps {
  name: string;
  value: string | number;
}

const SelectContext = createContext<SelectContextProps>({
  defaultValue: "",
  value: "",
  onChange: () => {
    return;
  },
  isOpen: false,
});

const useSelectContext = () => useContext(SelectContext);

const Select = ({
  defaultValue,
  value = "",
  onChange,
  defaultOpen,
  children,
}: PropsWithChildren<SelectProps>) => {
  const SelectProvider = SelectContext.Provider;
  const [isOpen, setOpen] = useState(defaultOpen ?? false);

  return (
    <SelectProvider value={{ defaultValue, value, onChange, isOpen, setOpen }}>
      {children}
    </SelectProvider>
  );
};

/**
 * @description Trigger 컴포넌트를 사용하는 순간 어떤 형태로든간에 open시키는 동작을 기대한다고 생각
 */
const Trigger = ({ children }: SelectOptionProps) => {
  const { isOpen, setOpen } = useSelectContext();
  const child = React.Children.only(children);
  const overrideClickEvent = (...args: any[]) => {
    if (child.props && typeof child.props["onClick"] === "function") {
      child.props["onClick"](...args);
    }
    return setOpen(!isOpen);
  };

  return React.cloneElement(child, {
    onClick: overrideClickEvent,
  });
};

/**
 * @description
 * OptionList는 하위에 들어오는 Option들의 visible 여부를 담당하는 역할로
 * 해당 context내의 isOpen 여부에 따라 Option의 Visible을 결정해준다
 *
 * 항상 나타나있는 Option의 경우에는 Select에 default값으로 isOpen을 true로 준다.
 */
const OptionList = ({ children }: PropsWithChildren<Partial<SelectProps>>) => {
  const { isOpen } = useSelectContext();

  return isOpen && <ul>{children}</ul>;
};

const Option = ({ children }: SelectOptionProps) => {
  return (
    <SelectContext.Consumer>
      {(props) => children({ ...props })}
    </SelectContext.Consumer>
  );
};

Select.Trigger = Trigger;
Select.OptionList = OptionList;
Select.Option = Option;

export default Select;

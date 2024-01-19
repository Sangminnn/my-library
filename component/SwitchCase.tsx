type Case = string | number;

interface SwitchCaseProps<Case extends string | number> {
  caseBy: Record<Case, React.ReactNode>;
  value: Case;
  defaultComponent?: React.ReactNode | null;
}

const SwitchCase = ({
  caseBy,
  value,
  defaultComponent = null,
}: SwitchCaseProps<Case>) => {
  return (caseBy[value] as JSX.Element) ?? defaultComponent;
};

export default SwitchCase;

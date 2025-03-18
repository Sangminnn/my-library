import { ReactNode, useState } from "react";

interface FoldedTextProps {
  text: string;
  maxLength: number;
  renderFolded: (props: {
    slicedText: string;
    toggleExpand: () => void;
  }) => ReactNode;
  renderExpanded: (props: {
    fullText: string;
    toggleExpand: () => void;
  }) => ReactNode;
}

const FoldedText = ({
  text,
  maxLength,
  renderFolded,
  renderExpanded,
}: FoldedTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const isOverMaxLength = text.length > maxLength;
  const slicedText = text.slice(0, maxLength);

  if (!isOverMaxLength) {
    return <>{renderExpanded({ fullText: text, toggleExpand })}</>;
  }

  if (isExpanded) {
    return <>{renderExpanded({ fullText: text, toggleExpand })}</>;
  }

  return <>{renderFolded({ slicedText, toggleExpand })}</>;
};

export default FoldedText;

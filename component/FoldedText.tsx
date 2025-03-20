"use client";
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
  const slicedText = `${text.slice(0, maxLength)}...`;

  if (!isExpanded && isOverMaxLength) {
    return <>{renderFolded({ slicedText, toggleExpand })}</>;
  }

  return <>{renderExpanded({ fullText: text, toggleExpand })}</>;
};

export default FoldedText;

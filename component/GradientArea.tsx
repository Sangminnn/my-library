import React, { PropsWithChildren } from "react";

import styled from "styled-components";

interface GradientAreaProps {
  startColor?: string;
  endColor?: string;
  gradientHeight?: number;
}

const GradientArea = ({
  startColor,
  endColor,
  gradientHeight,
  children,
}: PropsWithChildren<GradientAreaProps>) => {
  return (
    <OuterContainer>
      <TopGradientArea
        startColor={startColor}
        endColor={endColor}
        gradientHeight={gradientHeight}
      />
      {children}
      <BottomGradientArea
        startColor={startColor}
        endColor={endColor}
        gradientHeight={gradientHeight}
      />
    </OuterContainer>
  );
};

export default GradientArea;

const OuterContainer = styled.div`
  position: relative;
`;

const TopGradientArea = styled.div<GradientAreaProps>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: ${({ gradientHeight }) => `${gradientHeight}px`};
  background: ${({ startColor, endColor }) =>
    `linear-gradient(0deg, ${startColor} 0%, ${endColor} 100%)`};
  z-index: ${({ theme }) => theme.zIndex.SAFE_PAYMENT_RANKING_GRADIENT};
`;

const BottomGradientArea = styled.div<GradientAreaProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: ${({ gradientHeight }) => `${gradientHeight}px`};
  background: ${({ startColor, endColor }) =>
    `linear-gradient(180deg, ${startColor} 0%, ${endColor} 100%)`};
  z-index: ${({ theme }) => theme.zIndex.SAFE_PAYMENT_RANKING_GRADIENT};
`;

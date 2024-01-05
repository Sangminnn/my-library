import React, { PropsWithChildren } from "react";
import styled from "styled-components";

interface Props {
  as: Element;
  style: React.CSSProperties;
  ratio: number;
}

const AspectRatio = ({
  as,
  style,
  ratio,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <RatioWrapper style={style} ratio={ratio} as={as}>
      {children}
    </RatioWrapper>
  );
};

const RatioWrapper = styled.div<{ ratio: number }>`
  position: relative;
  width: 100%;
  padding-top: ${({ ratio }) => ratio && `${100 / ratio}%`};

  & > * {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
`;

export default AspectRatio;

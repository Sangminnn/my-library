import React, { PropsWithChildren } from "react";
import styled, { css } from "styled-components";

interface Props {
  as: Element;
  width: number;
  height: number;
  style: React.CSSProperties;
  ratio: number;
}

const aspectRatio = ({
  ratio,
  tag,
}: {
  ratio: number;
  tag: keyof JSX.IntrinsicElements;
}) => css`
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: calc(100% * ${ratio});

  & > ${tag} {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const AspectRatio = ({
  as,
  style,
  width,
  height,
  children,
}: PropsWithChildren<Props>) => {
  const ratio = height / width;
  return (
    <RatioWrapper style={style} ratio={ratio} as={as}>
      {children}
    </RatioWrapper>
  );
};

const RatioWrapper = styled.div<{ ratio: number }>`
  position: relative;
  width: 100%;
  padding-top: ${({ ratio }) => ratio && `calc(100% * ${ratio})`};

  & > * {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
`;

export default AspectRatio;

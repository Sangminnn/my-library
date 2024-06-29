import React, { PropsWithChildren } from "react";
import styled from "styled-components";

type BaseProps = {
  className?: string;
  style?: React.CSSProperties;
};

interface PropsWithWidthAndHeight extends BaseProps {
  width: number;
  height: number;
  ratio?: never;
}

interface PropsWithRatio extends BaseProps {
  width?: never;
  height?: never;
  ratio: number;
}

type Props = PropsWithWidthAndHeight | PropsWithRatio;
const AspectRatio = ({
  className,
  style,
  width,
  height,
  ratio,
  children,
}: PropsWithChildren<Props>) => {
  const calculatedRatio = ratio || height! / width!;

  return (
    <Wrapper className={className} style={style} ratio={calculatedRatio}>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ style?: React.CSSProperties; ratio: number }>`
  & > img,
  & > video {
    object-fit: cover;
  }

  @supports (aspect-ratio: 1 / 1) {
    aspect-ratio: ${({ ratio }) => ratio && `${ratio}`};
  }

  @supports not (aspect-ratio: 1 / 1) {
    position: relative;
    width: 100%;
    padding-top: ${({ ratio }) => ratio && `calc(100% * ${ratio})`};

    & > *:not(style) {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
  }
`;

export default AspectRatio;

import React, { Children, PropsWithChildren } from "react";
import styled from "styled-components";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  ratio: number;
}

const AspectRatio = ({
  className,
  style,
  ratio,
  children,
}: PropsWithChildren<Props>) => {
  const child = Children.only(children);

  return (
    <Wrapper className={className} style={style} ratio={ratio}>
      {child}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ style?: React.CSSProperties; ratio: number }>`
  & > img,
  & > video {
    object-fit: cover;
  }

  position: relative;
  width: 100%;
  padding-top: ${({ ratio }) => ratio && `calc(100% * ${1 / ratio})`};

  & > *:not(style) {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
`;

export default AspectRatio;

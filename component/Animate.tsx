import Row from "@components/row/Row";
import { isNumber } from "lodash-es";
import React, { useEffect } from "react";

import styled, { css, keyframes } from "styled-components";

interface Props {
  prevNumber: number | string;
  currentNumber: number | string;
}

const NUMBER_ARRAY = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const Animate = ({ prevNumber, currentNumber }: Props) => {
  const isNumber = (value: string) => {
    return /^[0-9]$/.test(value);
  };

  return (
    <Row>
      {currentNumber
        .toString()
        .split("")
        .map((value: string, i: number) => {
          const prev = Number(prevNumber.toString()[i]) || 0;
          const current = Number(currentNumber.toString()[i]);

          const originCurrent = currentNumber.toString()[i];

          if (!isNumber(originCurrent)) {
            return <Col key={i}>{value}</Col>;
          }

          return (
            <Col key={i}>
              <ColInner prev={prev} current={current}>
                {NUMBER_ARRAY.map((num, j: number) => (
                  <ColItem key={`${i}-${j}`}>{num}</ColItem>
                ))}
              </ColInner>
            </Col>
          );
        })}
    </Row>
  );
};

export default Animate;

const createAnimation = (prev: number, current: number) => keyframes`
  from {
    transform: translate3d(0px, -${24 * prev}px, 0px);
  }
  to {
    transform: translate3d(0px, -${24 * current}px, 0px);
  }
`;

const Col = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  height: 24px;
  overflow: hidden;
`;

const ColInner = styled.div<{ prev: number; current: number }>`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.5s ease-in-out;
  ${({ prev, current }) => css`
    animation: ${createAnimation(prev, current)} 0.5s ease-in-out forwards;
  `}
`;

const ColItem = styled.p`
  margin: 0;
  height: 24px;
  line-height: 1;
`;

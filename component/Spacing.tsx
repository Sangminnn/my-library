import styled, { css } from "styled-components";

const Spacing = styled.div<{
  width?: string | number;
  height?: string | number;
}>`
  flex: none;

  ${({ width, height }) => css`
    width: ${width || 0}px;
    height: ${height || 0}px;
  `}
`;

export default Spacing;

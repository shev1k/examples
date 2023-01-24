import React from 'react';
import styled from 'styled-components';

const GraphItemCircle = ({ children, isActive = false, ...rest }) => (
  <Circle isActive={isActive} {...rest}>
    {children}
  </Circle>
);

const Circle = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ebc0c0;
  flex-basis: 22px;
  flex-shrink: 0;

  ${({ isActive }) => {
    if (isActive) {
      return `
        background: #88E8C5;
        border: none;
      `;
    }
  }}
`;
export default GraphItemCircle;

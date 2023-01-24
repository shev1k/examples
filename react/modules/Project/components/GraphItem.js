import React from 'react';
import styled from 'styled-components';

import { ReactComponent as CheckIcon } from 'src/assets/icons/CheckIcon.svg';
import GraphItemCircle from './GraphItemCircle';

const GraphItem = ({
  description,
  isActive,
  containerStyles = {},
  circleStyles = {},
  descriptionStyles = {},
}) => {
  return (
    <Container className="graphItem" style={containerStyles}>
      <GraphItemCircle isActive={isActive} style={circleStyles}>
        {isActive && <CheckIcon />}
      </GraphItemCircle>
      <Description isActive={isActive} style={descriptionStyles}>
        {description}
      </Description>
    </Container>
  );
};

const ACTIVE_COLOR = '#88E8C5';
const DEFAULT_COLOR = '#ebc0c0';

const Container = styled.div`
  display: flex;
  align-items: center;
  border-radius: 7px 5px 5px 7px;
  margin-bottom: 20px;
  z-index: 5;
  background: white;
  white-space: nowrap;
`;

const Description = styled.span`
  width: fit-content;
  padding: 2px 20px 2px 15px;
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-right: 1px solid;
  border-color: ${DEFAULT_COLOR};
  margin-left: -10px;
  border-radius: 0 7px 7px 0;

  ${({ isActive }) => {
    if (isActive) {
      return `
        border-color: ${ACTIVE_COLOR};
      `;
    }
  }}
`;

export default GraphItem;

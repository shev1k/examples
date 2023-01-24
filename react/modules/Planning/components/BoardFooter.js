import React from 'react';
import styled from 'styled-components';

const BoardFooter = () => {
  return (
    <Container>
      <ButtonsContainer>
        <Button role="button" variant="outlined">
          Reset
        </Button>
        <Button role="button" variant="contained">
          Populate to Jira
        </Button>
      </ButtonsContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const ButtonsContainer = styled.div`
  width: fit-content;
  margin-left: auto;
  display: flex;
  align-items: center;
  height: 25px;
  margin-top: 10px;
  margin-bottom: 25px;

  > div:first-child {
    margin-right: 15px;
  }
`;

const Button = styled.div`
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 500;
  line-height: 12px;
  color: #484848;
  border-radius: 7px;
  padding: 7px 30px;

  ${({ variant }) => {
    if (variant === 'outlined') {
      return `
        border: 1px solid #C4C4C4;
        background: white;
      `;
    }

    if (variant === 'contained') {
      return `
        background: #41CCD5;
      `;
    }
  }}
`;

export default BoardFooter;

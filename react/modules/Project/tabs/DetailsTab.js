import React from 'react';
import styled from 'styled-components';

import { JiraParser } from 'src/packages/JiraParser';

const DetailsTab = ({ summary, description }) => {
  return (
    <Container>
      <Summary>{summary}</Summary>
      <Description>Description</Description>
      <DescriptionContainer>
        <JiraParser text={description} />
      </DescriptionContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-bottom: 10px;
`;

const Summary = styled.h3`
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #484848;
`;

const Description = styled.h4`
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 500;
`;

const DescriptionContainer = styled.div`
  border: 1px solid #c4c4c4;
  border-radius: 2px;
  padding: 5px;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
`;

export default DetailsTab;

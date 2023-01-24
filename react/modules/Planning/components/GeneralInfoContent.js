import React from 'react';
import styled from 'styled-components';

const GeneralInfoContent = ({ risks }) => {
  const renderRisks = () =>
    risks.map((risk, index) => (
      <RisksContainer key={index}>
        <Bubble>{risk.risk_group}</Bubble>
        <Description title={risk.short_description}>
          {risk.short_description}
        </Description>
      </RisksContainer>
    ));

  return <Container>{renderRisks()}</Container>;
};

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
`;

const RisksContainer = styled.div`
  background: #ffffff;
  border: 1px solid #dfdfdf;
  padding: 10px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

const Bubble = styled.p`
  font-family: Montserrat;
  font-size: 12px;
  padding: 2px 4px;
  background: #dfdfdf;
  border-radius: 10px;
  text-transform: capitalize;
  margin: 0 15px 0 0;
  text-align: center;
  min-width: 60px;
  height: fit-content;
`;

const Description = styled.p`
  font-family: Montserrat;
  font-size: 12px;
  line-height: 12px;
  margin: 5px 0 0 0;
  white-space: break-word;
`;

export default GeneralInfoContent;

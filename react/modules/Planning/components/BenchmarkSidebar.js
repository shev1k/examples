import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { getBenchmark } from '../reducer';
import { ReactComponent as HoursIcon } from 'src/assets/risks/HoursIcon.svg';
import { ReactComponent as IssuesIcon } from 'src/assets/risks/IssuesIcon.svg';
import { ReactComponent as NoDescriptionIcon } from 'src/assets/risks/NoDescriptionIcon.svg';
import { ReactComponent as NoEstimateIcon } from 'src/assets/risks/NoEstimateIcon.svg';
import { ReactComponent as TooBigIcon } from 'src/assets/risks/TooBigIcon.svg';
import { ReactComponent as UpdateRateIcon } from 'src/assets/risks/UpdateRateIcon.svg';

const filterNaN = (benchmark) => {
  return Object.entries(benchmark).reduce((acc, [key, val]) => {
    if (Number.isNaN(val)) {
      acc[key] = 0;
    } else {
      acc[key] = val;
    }

    return acc;
  }, {});
};

const formatNumberDisplay = (n, ending = '') => {
  if (n === 0) {
    return '-';
  }

  return n + ending;
};

const BenchmarkSidebar = ({ SPRINT_AVERAGE_COUNT }) => {
  const {
    resolvedTime,
    resolvedIssues,
    tooBigRisks,
    noEstimateRisks,
    noDescriptionRisks,
    descriptionUpdateRate,
  } = filterNaN(useSelector(getBenchmark));

  return (
    <Container>
      <Block>
        <Heading style={{ marginBottom: 5, fontSize: 16, fontWeight: 'bold' }}>
          Benchmarks
        </Heading>
        <SubHeading>{SPRINT_AVERAGE_COUNT}-Sprint average</SubHeading>
      </Block>
      <Block>
        <Heading>Planned & resolved</Heading>
        <StatsContainer>
          <IconContainer>
            <HoursIcon />
          </IconContainer>
          <Value>{formatNumberDisplay(resolvedTime)}</Value>
          <Description>hrs</Description>
        </StatsContainer>
        <StatsContainer>
          <IconContainer>
            <IssuesIcon />
          </IconContainer>
          <Value>{formatNumberDisplay(resolvedIssues)}</Value>
          <Description>issues</Description>
        </StatsContainer>
      </Block>
      <Block>
        <Heading>Backlog quality</Heading>
        <StatsContainer>
          <IconContainer>
            <TooBigIcon />
          </IconContainer>
          <Value>{formatNumberDisplay(tooBigRisks, '%')}</Value>
          <Description>Too Big</Description>
        </StatsContainer>
        <StatsContainer>
          <IconContainer>
            <NoEstimateIcon />
          </IconContainer>
          <Value>{formatNumberDisplay(noEstimateRisks, '%')}</Value>
          <Description>No Estimate</Description>
        </StatsContainer>
        <StatsContainer>
          <IconContainer>
            <NoDescriptionIcon />
          </IconContainer>
          <Value>{formatNumberDisplay(noDescriptionRisks, '%')}</Value>
          <Description>No Desc/Ac</Description>
        </StatsContainer>
        <StatsContainer>
          <IconContainer>
            <UpdateRateIcon />
          </IconContainer>
          <Value>{formatNumberDisplay(descriptionUpdateRate, 'x')}</Value>
          <Description>Desc update</Description>
        </StatsContainer>
      </Block>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding: 12px;
  margin-bottom: 25px;
  width: 200px;
  min-height: 100%;
  border: 1px solid #c4c4c4;
  border-radius: 3px;
  background: #fafafa;
  flex-shrink: 0;
`;

const Block = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-bottom: 25px;
`;

const Heading = styled.p`
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 600;
  color: #484848;
`;

const SubHeading = styled.p`
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 500;
  color: #858585;
`;

const StatsContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: baseline;
  margin-bottom: 5px;
`;

const IconContainer = styled.div`
  width: 25px;
`;

const Value = styled.span`
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 700;
  color: #484848;
  margin-right: 7px;
  min-width: 35px;
  text-align: right;
`;

const Description = styled.span`
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 400;
  color: #858585;
`;

export default BenchmarkSidebar;

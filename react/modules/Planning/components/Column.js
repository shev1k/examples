import React, { useState, useEffect, useCallback, memo } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { getBenchmark } from '../reducer';
import { ReactComponent as HoursIcon } from 'src/assets/risks/HoursIcon.svg';
import { ReactComponent as IssuesIcon } from 'src/assets/risks/IssuesIcon.svg';
import { ReactComponent as NoDescriptionIcon } from 'src/assets/risks/NoDescriptionIcon.svg';
import { ReactComponent as NoEstimateIcon } from 'src/assets/risks/NoEstimateIcon.svg';
import { ReactComponent as TooBigIcon } from 'src/assets/risks/TooBigIcon.svg';
import { ReactComponent as UpdateRateIcon } from 'src/assets/risks/UpdateRateIcon.svg';

import Issue from './Issue';

const metricColors = {
  bad: '#D30000',
  equal: '#484848',
  good: '#11865B',
};

const Issues = memo(({ issues }) =>
  issues.map(({ key, ...issue }, index) => (
    <Draggable
      key={String(issue.id)}
      draggableId={String(issue.id)}
      index={index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Issue provided={provided} index={index} issue_key={key} {...issue} />
        </div>
      )}
    </Draggable>
  )),
);

const Column = ({ id, sprint_name, issues }) => {
  const calculateMetrics = useCallback((issues) => {
    const totalIssues = issues.length;

    const {
      totalSeconds,
      totalTooBig,
      totalNoEstimate,
      totalNoDescription,
      totalUpdateRate,
    } = issues.reduce(
      (acc, issue) => {
        acc.totalSeconds += issue.timeoriginalestimate || 0;
        acc.totalUpdateRate += issue.desc_update_rate || 0;

        if (issue.is_too_big) {
          acc.totalTooBig += 1;
        }

        if (issue.is_no_estimate) {
          acc.totalNoEstimate += 1;
        }

        if (issue.is_no_desc) {
          acc.totalNoDescription += 1;
        }

        return acc;
      },
      {
        totalSeconds: 0,
        totalTooBig: 0,
        totalNoEstimate: 0,
        totalNoDescription: 0,
        totalUpdateRate: 0,
      },
    );

    return {
      totalHours: Math.round(totalSeconds / 3600),
      totalIssues,
      averageTooBig:
        totalIssues !== 0 ? Math.round((totalTooBig / totalIssues) * 100) : 0,
      averageNoEstimate:
        totalIssues !== 0
          ? Math.round((totalNoEstimate / totalIssues) * 100)
          : 0,
      averageNoDescription:
        totalIssues !== 0
          ? Math.round((totalNoDescription / totalIssues) * 100)
          : 0,
      averageUpdateRate: totalIssues !== 0 ? totalUpdateRate / totalIssues : 0,
    };
  }, []);

  const [metrics, setMetrics] = useState(calculateMetrics(issues));
  const benchmark = useSelector(getBenchmark);

  const getMetricColor = useCallback(
    (benchmarkAverage, currentAverage, reverse = false) => {
      const { good, equal, bad } = metricColors;
      const styles = {
        color: equal,
      };

      if (benchmarkAverage > currentAverage) {
        styles.color = reverse ? bad : good;
      }

      if (benchmarkAverage === currentAverage) {
        styles.color = equal;
      }

      if (benchmarkAverage < currentAverage) {
        styles.color = reverse ? good : bad;
      }

      return styles;
    },
    [],
  );

  const normalizeNum = useCallback((num, ending = '') => {
    if (parseFloat(num) === 0) {
      return '-';
    }

    return num + ending;
  }, []);

  useEffect(() => {
    setMetrics(calculateMetrics(issues));
  }, [issues, calculateMetrics]);

  const columnName = id >= 0 ? sprint_name : 'Backlog';

  return (
    <Container>
      <Header>
        <h5>{columnName}</h5>
        <MetricsContainer>
          <Metric>
            <IconContainer>
              <HoursIcon />
            </IconContainer>
            <span
              style={getMetricColor(benchmark.resolvedTime, metrics.totalHours)}
            >
              {normalizeNum(metrics.totalHours)}
            </span>
          </Metric>
          <Metric>
            <IconContainer>
              <IssuesIcon />
            </IconContainer>
            <span
              style={getMetricColor(
                benchmark.resolvedIssues,
                metrics.totalIssues,
              )}
            >
              {normalizeNum(metrics.totalIssues)}
            </span>
          </Metric>
          <Metric>
            <IconContainer>
              <TooBigIcon />
            </IconContainer>
            <span
              style={getMetricColor(
                benchmark.tooBigRisks,
                metrics.averageTooBig,
              )}
            >
              {normalizeNum(metrics.averageTooBig, '%')}
            </span>
          </Metric>
          <Metric>
            <IconContainer>
              <NoEstimateIcon />
            </IconContainer>
            <span
              style={getMetricColor(
                benchmark.noEstimateRisks,
                metrics.averageNoEstimate,
              )}
            >
              {normalizeNum(metrics.averageNoEstimate, '%')}
            </span>
          </Metric>
          <Metric>
            <IconContainer>
              <NoDescriptionIcon />
            </IconContainer>
            <span
              style={getMetricColor(
                benchmark.noDescriptionRisks,
                metrics.averageNoDescription,
              )}
            >
              {normalizeNum(metrics.averageNoDescription, '%')}
            </span>
          </Metric>
          <Metric>
            <IconContainer>
              <UpdateRateIcon />
            </IconContainer>
            <span
              style={getMetricColor(
                benchmark.descriptionUpdateRate,
                parseFloat(metrics.averageUpdateRate.toFixed(2)),
                true,
              )}
            >
              {normalizeNum(metrics.averageUpdateRate.toFixed(2), 'x')}
            </span>
          </Metric>
        </MetricsContainer>
      </Header>
      <Scroll>
        <Droppable droppableId={String(id)}>
          {(provided) => (
            <IssuesContainer
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <Issues issues={issues} id={id} />
            </IssuesContainer>
          )}
        </Droppable>
      </Scroll>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 20%;
  min-width: 250px;
  max-width: 350px;
  border: 1px solid #c4c4c4;
  border-radius: 3px;
  background: #fafafa;
  margin: 0 10px;
  flex-shrink: 0;
`;

const Header = styled.div`
  display: flex;
  flex-flow: column nowrap;
  border-bottom: 1px solid #c4c4c4;

  > h5 {
    font-family: Montserrat;
    font-weight: bold;
    font-size: 16px;
    color: #484848;
    margin-bottom: 15px;
    padding: 12px 12px 0 12px;
  }
`;

const MetricsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px 5px 12px;
`;

const Metric = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  > span {
    margin-top: 5px;
    font-family: Montserrat;
    font-size: 12px;
    font-weight: 700;
    text-align: center;
  }
`;

const Scroll = styled.div`
  height: 100%;
  min-height: 58vh;
  max-height: 58vh;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 0px;
    border-radius: 3px;
  }
`;

const IssuesContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding: 5px 5px 100% 5px;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 17px;
  height: 17px;
`;

export default memo(Column);

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import DefaultButton from 'src/components/Buttons/DefaultButton';
import GraphItem from './GraphItem';
import GraphItemCircle from './GraphItemCircle';

const Graph = ({
  actions,
  completed_strikes,
  incomplete_strikes,
  risks,
  isDone,
}) => {
  const [containerRef, setContainerRef] = useState(null);

  const renderCompletedStrikes = () => {
    if (completed_strikes.length === 0) {
      return <GraphItem description={'Added to sprint'} isActive />;
    }

    return completed_strikes.map((strike) => (
      <GraphItem
        key={`completed-strike-${strike.id}`}
        description={strike.description}
        isActive
      />
    ));
  };

  const renderIncompleteStrikes = () => {
    return incomplete_strikes.map((strike) => (
      <GraphItem
        key={`incomplete-strike-${strike.id}`}
        description={strike.description}
        isActive={false}
        descriptionStyles={{ borderColor: '#88E8C5' }}
        circleStyles={{ borderColor: '#88E8C5' }}
      />
    ));
  };

  const renderRisks = () => {
    return risks.map((risk) => (
      <GraphItem
        key={`risk-${risk.id}`}
        description={risk.description}
        isActive={false}
        containerStyles={{ marginLeft: 40 }}
      />
    ));
  };

  const renderActions = () => {
    return actions.map((action, index) => (
      <DefaultButton
        className="graphItem"
        style={{
          zIndex: 5,
          width: 'fit-content',
          display: 'inline-block', // mojet nado ubrat hzhz
        }}
        key={`action-${action.id}`}
        onClick={action.onClick}
      >
        {action.description}
      </DefaultButton>
    ));
  };

  const renderPath = () => {
    if (containerRef) {
      const graphItems = [...containerRef.getElementsByClassName('graphItem')];
      let points = ``;

      // Line should go through each first item on each row.
      const filteredGraphItems = graphItems.filter(
        (graphItem) => graphItem.offsetLeft <= SHIFT_VALUE,
      );

      filteredGraphItems.forEach((graphItem) => {
        points += `${graphItem.offsetLeft + 10}, ${
          graphItem.offsetTop + graphItem.offsetHeight / 2
        } `;
      });

      return (
        <polyline
          points={points}
          fill="none"
          stroke="#c4c4c4"
          strokeWidth="3"
        />
      );
    }
  };

  useEffect(() => {
    // Force connector line points recalculate
    if (containerRef) {
      setContainerRef(containerRef.cloneNode());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, completed_strikes, incomplete_strikes, risks]);

  const shouldShowActions = actions.length !== 0;
  const shouldShowAdditionalCircle = actions.length !== 0 || risks.length !== 0;

  return (
    <Container ref={(ref) => setContainerRef(ref)}>
      <DashedLine />
      <ConnectorLine>{renderPath()}</ConnectorLine>
      {renderCompletedStrikes()}
      {renderRisks()}
      {shouldShowActions && <Actions>{renderActions()}</Actions>}
      {shouldShowAdditionalCircle && (
        <GraphItemCircle
          style={{ zIndex: 5, marginBottom: 20 }}
          className="graphItem"
        />
      )}
      {renderIncompleteStrikes()}
      {
        <GraphItem
          description="🎉 Done"
          isActive={isDone}
          descriptionStyles={{ borderColor: '#88E8C5' }}
          circleStyles={{ borderColor: '#88E8C5' }}
        />
      }
    </Container>
  );
};

const FREE_SPACE_BELOW_CONTAINER = 30;
const SHIFT_VALUE = 40;

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  overflow-x: auto;
  padding-bottom: ${FREE_SPACE_BELOW_CONTAINER}px;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  margin-left: ${SHIFT_VALUE}px;

  > button {
    font-size: 12px;
    margin-right: 15px;
    margin-bottom: 10px;
  }
`;

const DashedLine = styled.div`
  background-image: linear-gradient(white 40%, #c4c4c4 0%);
  background-position: right;
  background-size: 2px 7px;
  background-repeat: repeat-y;
  width: 2px;
  height: calc(100% - ${FREE_SPACE_BELOW_CONTAINER + 20}px);
  position: absolute;
  top: 0;
  left: 9px;
  z-index: 1;
`;

const ConnectorLine = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
`;

export default Graph;

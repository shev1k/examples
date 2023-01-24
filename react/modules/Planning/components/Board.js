import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import BoardHeader from './BoardHeader';
import BoardFooter from './BoardFooter';
import BenchmarkSidebar from './BenchmarkSidebar';
import Columns from './Columns';
import GeneralInfo from './GeneralInfo';
import { getSelectedIssue } from '../reducer';

const Board = ({ SPRINT_AVERAGE_COUNT }) => {
  const selectedIssue = useSelector(getSelectedIssue);

  return (
    <Container>
      <BoardHeader />
      <Content>
        <BenchmarkSidebar SPRINT_AVERAGE_COUNT={SPRINT_AVERAGE_COUNT} />
        <ColumnsContainer>
          <div
            style={{
              display: 'flex',
              marginBottom: 25,
            }}
          >
            <Columns />
            <PlaceHolder />
          </div>
        </ColumnsContainer>
        {selectedIssue && <GeneralInfo />}
      </Content>
      {/* <BoardFooter /> */}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-top: 25px;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`;

const ColumnsContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-left: 25px;
  overflow: overlay;
`;

const PlaceHolder = styled.div`
  flex-basis: 600px;
  width: 45%;
  background: #fafafa;
  flex: 0 0 auto;
`;

export default Board;

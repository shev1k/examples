import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import CloseIcon from 'src/assets/icons/CloseIcon.png';
import GeneralInfoHeader from './GeneralInfoHeader';
import GeneralInfoContent from './GeneralInfoContent';
import { getSelectedIssue } from '../reducer';
import { clearSelectedIssue as clearSelectedIssueAction } from '../actions';

const GeneralInfo = () => {
  const dispatch = useDispatch();
  const selectedIssue = useSelector(getSelectedIssue);

  const clearSelectedIssue = () => dispatch(clearSelectedIssueAction());

  const handleClose = () => clearSelectedIssue();

  if (!selectedIssue) {
    return null;
  }

  const { summary, description, risks } = selectedIssue;

  return (
    <Container>
      <CloseContainer onClick={handleClose}>
        <img style={{ width: 15, height: 15 }} src={CloseIcon} alt="close" />
      </CloseContainer>
      <Content>
        <GeneralInfoHeader summary={summary} description={description} />
        <GeneralInfoContent risks={risks} />
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 30%;
  height: calc(100% + 26px);
  position: absolute;
  top: -26px;
  right: -30px;
  display: flex;
  flex-flow: column nowrap;
`;

const CloseContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 5px 15px 5px 0;
  text-align: right;
  cursor: pointer;
`;

const Content = styled.div`
  display: flex;
  flex-flow: column nowrap;
  background: #fff;
  padding: 7px 15px;
  border-radius: 3px;
  height: 100%;
  border: 1px solid #dfdfdf;
`;

export default memo(GeneralInfo);

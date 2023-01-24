import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { ReactComponent as TooBigGreyIcon } from 'src/assets/risks/TooBigGreyIcon.svg';
import { ReactComponent as TooBigGreyActiveIcon } from 'src/assets/risks/TooBigGreyActiveIcon.svg';
import { ReactComponent as NoEstimateGreyIcon } from 'src/assets/risks/NoEstimateGreyIcon.svg';
import { ReactComponent as NoEstimateGreyActiveIcon } from 'src/assets/risks/NoEstimateGreyActiveIcon.svg';
import { ReactComponent as NoDescriptionGreyIcon } from 'src/assets/risks/NoDescriptionGreyIcon.svg';
import { ReactComponent as NoDescriptionGreyActiveIcon } from 'src/assets/risks/NoDescriptionGreyActiveIcon.svg';
import { ReactComponent as LowUpdateRateGreyIcon } from 'src/assets/risks/LowUpdateRateGreyIcon.svg';
import { ReactComponent as LowUpdateRateGreyActiveIcon } from 'src/assets/risks/LowUpdateRateGreyActiveIcon.svg';

import {
  setSelectedIssue as setSelectedIssueAction,
  clearSelectedIssue as clearSelectedIssueAction,
} from '../actions';
import { getSelectedIssue } from '../reducer';
import { getNameInitials, getIssueTypeIcon } from 'src/utils/utils';
import { formatJiraApiUrl } from 'src/utils/format';
import AssigneeCircle from 'src/components/AssigneeCircle';

const Issue = ({
  id,
  epic_link_name,
  epic_link_key,
  epic_link_url,
  issuetype_name,
  issue_key,
  url,
  assignee_displayname,
  timeoriginalestimate,
  is_too_big,
  is_no_estimate,
  is_no_desc,
  is_low_desc_update_rate,
  issuetype_subtask,
  isHidden,
  description,
  summary,
  risks = [],
  subtasks,
}) => {
  const dispatch = useDispatch();
  const selectedIssue = useSelector(getSelectedIssue);
  const isActive = selectedIssue && selectedIssue.id === id;
  const epicLink = formatJiraApiUrl(epic_link_url, epic_link_key);
  const issueLink = formatJiraApiUrl(url, issue_key);

  const handleLinkClick = (e) => e.stopPropagation();

  const setSelectedIssue = ({ selectedIssue }) =>
    dispatch(setSelectedIssueAction({ selectedIssue }));

  const clearSelectedIssue = () => dispatch(clearSelectedIssueAction());

  const handleClick = (e) => {
    e.stopPropagation();
    if (selectedIssue && selectedIssue.id === id) {
      clearSelectedIssue();
    } else {
      setSelectedIssue({ selectedIssue: { description, summary, risks, id } });
    }
  };

  if (isHidden) {
    return null;
  }

  return (
    <div style={{ border: '1px solid #cacaca', marginBottom: 4 }}>
      <Container onClick={handleClick} isActive={isActive}>
        <Summary>{summary}</Summary>
        {epic_link_name && (
          <EpicNameContainer
            target="_blank"
            rel="noopener noreferrer"
            href={epicLink}
            onClick={handleLinkClick}
          >
            <EpicName>{epic_link_name}</EpicName>
          </EpicNameContainer>
        )}
        <IssueData>
          <div>
            {getIssueTypeIcon(issuetype_name)}
            <IssueKey
              target="_blank"
              rel="noopener noreferrer"
              href={issueLink}
              onClick={handleLinkClick}
            >
              {issue_key}
            </IssueKey>
            <AssigneeCircle styles={{ marginLeft: 6 }}>
              {getNameInitials(assignee_displayname || '') || 'n.a'}
            </AssigneeCircle>
          </div>
          <p>
            <Estimate>
              {Math.round(timeoriginalestimate / 3600) || '-'}
            </Estimate>
            <Hours> h</Hours>
          </p>
        </IssueData>
        {!issuetype_subtask && (
          <RisksContainer>
            {is_too_big ? <TooBigGreyActiveIcon /> : <TooBigGreyIcon />}
            {is_no_estimate ? (
              <NoEstimateGreyActiveIcon />
            ) : (
              <NoEstimateGreyIcon />
            )}
            {is_no_desc ? (
              <NoDescriptionGreyActiveIcon />
            ) : (
              <NoDescriptionGreyIcon />
            )}
            {is_low_desc_update_rate ? (
              <LowUpdateRateGreyActiveIcon />
            ) : (
              <LowUpdateRateGreyIcon />
            )}
          </RisksContainer>
        )}
      </Container>
      {subtasks && subtasks.length !== 0 && (
        <SubtasksContainer>
          {subtasks.map((subtask) => (
            <Issue key={`subtask-${subtask.id}`} {...subtask} />
          ))}
        </SubtasksContainer>
      )}
    </div>
  );
};

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer !important;
  background: #fff;

  ${({ isActive }) => {
    if (isActive) {
      return 'background: #dfdfdf';
    }
  }}
`;

const Summary = styled.p`
  overflow-wrap: break-word;
  margin: 0;
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`;

const EpicNameContainer = styled.a`
  background: #baf3ff;
  width: fit-content;
  color: rgb(60, 75, 100) !important;
  border-radius: 3px;
  margin-top: 5px;
  padding: 0 3px;
  margin-left: -3px;
`;

const EpicName = styled.p`
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 400;
  margin: 0;
`;

const IssueData = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > div {
    display: flex;
    align-items: center;
  }

  > p {
    margin: 0;
    font-family: Montserrat;
    font-size: 12px;
    font-weight: 700;
  }
`;

const IssueKey = styled.a`
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 400;
  color: #858585 !important;
  margin-left: 6px;
`;

const Estimate = styled.span`
  color: #484848;
`;

const Hours = styled.span`
  font-size: 9px;
  color: #a0a0a2;
`;

const RisksContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 10px;
  padding-bottom: 5px;

  > svg {
    margin: 0 10px;
  }
`;

const SubtasksContainer = styled.div`
  margin: 10px 0 0 25px;

  > div {
    margin-bottom: 3px;
  }
`;

export default memo(Issue);

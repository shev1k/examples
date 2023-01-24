import React, { useState, useCallback, memo } from 'react';
import styled from 'styled-components';

import StatusSelect from '../components/StatusSelect';
import { getIssueTypeIcon } from 'src/utils/utils';
import { logEvent } from 'src/config/amplitude';
import { columns } from '../metadata';

const formatAssignee = (assignee_displayname) => {
  if (assignee_displayname) {
    const [firstName, lastName] = assignee_displayname.split(' ');
    let result = '';

    if (firstName && !lastName) {
      return firstName.slice(0, 2).toUpperCase();
    }

    if (!firstName && lastName) {
      return lastName.slice(0, 2).toUpperCase();
    }

    if (firstName && firstName.length > 0) {
      result += firstName[0];
    }

    if (lastName && lastName.length > 0) {
      result += lastName[0];
    }

    return result.toUpperCase();
  }

  return 'n.a';
};

const ProjectRisksTable = ({
  groupName,
  groupNamesWithCategory,
  issues,
  selectedIssue,
  handleOrderChange,
  handleIssueSelect,
}) => {
  const [fold, setFold] = useState(false);

  const toggleFold = useCallback(() => {
    logEvent('Project tab fold', {
      fold_state: fold,
      tab_name: groupName,
    });

    setFold(!fold);
  }, [fold, groupName]);

  const renderRow = useCallback(
    (d, index) => {
      const {
        issuetype_name,
        key,
        url = '',
        summary,
        assignee_displayname,
        timeoriginalestimate,
        cnt,
        issuetype_subtask: isSubtask,
        isDuplicate,
        subtasks,
      } = d;
      const isActive =
        selectedIssue && key === selectedIssue.key && !isDuplicate;

      const URLRegex = url.match(/https:\/\/[a-zA-Z.]+/);
      const URL = URLRegex ? URLRegex[0] + '/browse/' + key : null;
      const timeEstimate = () => {
        if (timeoriginalestimate > 3600) {
          return (
            <TimeOriginalEstimate>
              {Math.round(timeoriginalestimate / 3600, -1)}h
            </TimeOriginalEstimate>
          );
        } else {
          return (
            <TimeOriginalEstimate>
              {Math.round(timeoriginalestimate / 60, -1)}m
            </TimeOriginalEstimate>
          );
        }
      };

      let subs = [];

      if (subtasks) {
        subs = subtasks.map((sub, i) => renderRow(sub, i));
      }

      return (
        <>
          <Row
            isDuplicate={isDuplicate}
            isActive={isActive}
            isSubtask={isSubtask}
            onClick={() => handleIssueSelect(d)}
            key={`row-${groupName}-${index}`}
          >
            <td className="issuetype_name">
              <IssueTypeIconContainer isActive={isActive} isSubtask={isSubtask}>
                {getIssueTypeIcon(issuetype_name)}
              </IssueTypeIconContainer>
            </td>
            <td className="key">
              <IssueKey
                onClick={(event) => {
                  event.stopPropagation();
                  logEvent('Project table URL click', {
                    tab_name: groupName,
                    issue_key: key,
                    url: URL,
                  });
                }}
                target="_blank"
                rel="noopenner noreferrer"
                href={URL}
              >
                {key}
              </IssueKey>
            </td>
            <td className="summary">{summary}</td>
            <td className="assignee_displayname">
              <IssueAssignee isActive={isActive} title={assignee_displayname}>
                {formatAssignee(assignee_displayname)}
              </IssueAssignee>
            </td>
            <td className="timeoriginalestimate">{timeEstimate()}</td>
            <td className="cnt">
              {isSubtask ? null : <IssueCount>{cnt}</IssueCount>}
            </td>
          </Row>
          {subs}
        </>
      );
    },
    [groupName, handleIssueSelect, selectedIssue],
  );

  const renderRows = () => {
    if (issues.length > 0) {
      return issues.map((d, i) => renderRow(d, i));
    }

    return (
      <EmptyContainer>
        <Empty colSpan={columns.length}>
          <p style={{ margin: '2px 0 0 18px' }}>No issues</p>
        </Empty>
      </EmptyContainer>
    );
  };

  if (!groupName) {
    return <div />;
  }

  return (
    <>
      <tr>
        <td colSpan={columns.length}>
          <StatusSelect
            fold={fold}
            groupName={groupName}
            groupNamesWithCategory={groupNamesWithCategory}
            toggleFold={toggleFold}
            handleOrderChange={handleOrderChange}
          />
        </td>
      </tr>

      {!fold && renderRows()}
    </>
  );
};

const IssueKey = styled.a`
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 400;
  color: #5772ff;
`;

const IssueAssignee = styled.p`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  font-family: Montserrat;
  font-size: 10px;
  color: #484848;
  background: ${({ isActive }) => (isActive ? '#FFF' : '#C1C7D0')};
  border: 0.5px solid #c1c7d0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;

const TimeOriginalEstimate = styled.p`
  width: fit-content;
  padding: 1px 4px;
  border-radius: 7px;
  font-family: Montserrat;
  font-size: 10px;
  color: #484848;
  border: 0.5px solid #c1c7d0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  background: #fff;
`;

const IssueCount = styled.p`
  font-family: Montserrat;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  background: #d30000;
  border-radius: 7px;
  color: #ffffff;
  text-align: center;
  width: fit-content;
  min-width: 25px;
  padding: 0 8px;
  margin: 0 auto;
`;

const IssueTypeIconContainer = styled.div`
  ${({ isSubtask, isActive }) => {
    let styles = ``;

    if (isSubtask) {
      styles += `
        padding: 10px;
        border-bottom: 1px solid #dfdfdf;
        border-left: 1px solid #dfdfdf;
        background: #fff;
      `;
    }

    if (isActive) {
      styles += `
        background: #DFDFDF;
        border-right: 5px solid #DFDFDF;
      `;
    }

    return styles;
  }}
`;

const Row = styled.tr`
  background: #fff;
  position: relative;

  ${({ isActive, isSubtask, isDuplicate }) => {
    let styles = `
      td {
        &:nth-child(4) {
          > p {
            &::after {
              content: '';
              width: 5px;
              height: 100%;
              background: #fff;
              position: absolute;
              top: 0;
              left: -3px;
            }
          }
        }

        &::after {
          content: '';
          width: 5px;
          height: 100%;
          background: #fff;
          position: absolute;
          top: 0;
          right: -3px;
        }
      }
    `;

    if (isActive) {
      styles += `
        background: #DFDFDF;

        td {
          &:nth-child(4) {
            > p {
              &::after {
                content: '';
                width: 5px;
                height: 100%;
                background: #dfdfdf;
                position: absolute;
                top: 0;
                left: -3px;
              }
            }
          }

          &::after {
            content: '';
            width: 5px;
            height: 100%;
            background: #dfdfdf;
            position: absolute;
            top: 0;
            right: -3px;
          }
        }
      `;
    }

    if (isDuplicate) {
      styles += `
        td::before {
          content: '';
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background: white;
          opacity: 0.55;
        }
      `;
    }

    if (isSubtask) {
      styles += `
        td {
          font-size: 12px !important;
          border-left: none !important;

          &:nth-child(1) {
            background: #FAFAFA !important;
            padding: 0;
            padding-left: 18px;
            border: none;
          }

          &:nth_child(5) > p {
            font-size: 8px !important;
          }

          & > a {
            font-size: 12px !important;
          }
        }
      `;
    }

    return styles;
  }}
`;

const EmptyContainer = styled.tr`
  font-size: 16px;
  background: #fafafa;
  border-radius: 3px;
`;

const Empty = styled.td`
  padding: 3px 6px;
  border-radius: 3px;
  font-family: Montserrat;
`;

export default memo(ProjectRisksTable);

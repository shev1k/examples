import React, { useEffect } from 'react';
import styled from 'styled-components';

import AssigneeCircle from 'src/components/AssigneeCircle';
import HistoryRowItem from '../components/HistoryRowBodyItem';
import HistoryColumnItem from '../components/HistoryColumnBodyItem';
import { logEvent } from 'src/config/amplitude';
import { getMonthName } from 'src/utils/date';
import { getNameInitials } from 'src/utils/utils';

const formatDateDisplay = (date) => {
  const d = new Date(date);
  const monthName = getMonthName(d);

  return `${d.getDate()} ${monthName}`;
};

const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes} `;
};

const HistoryTab = ({ selectedIssue, historyMap }) => {
  const renderHistoryItemBody = ({ action, actionDescription }) => {
    const { display, body } = actionDescription;

    if (display === 'row') {
      return <HistoryRowItem action={action} body={body} />;
    }

    if (display === 'column') {
      return <HistoryColumnItem body={body} />;
    }

    return null;
  };

  const renderHistoryItem = (
    { author, action, actionType, actionScope, actionTime, actionDescription },
    groupDate,
    index,
  ) => (
    <HistoryItem key={`${groupDate}-${index}`}>
      <HistoryItemHeader>
        <AssigneeCircle styles={{ margin: '0 15px 0 0' }}>
          {author ? getNameInitials(author) : 'n.a'}
        </AssigneeCircle>
        <span className="bold">{author || 'n.a'}</span>
        <span style={{ margin: '0 10px' }}>{actionType}</span>
        <span className="bold">{actionScope}</span>
        <span className="timespent">
          {actionTime ? formatTime(actionTime.split(' ')[1]) : 'n.a'}
        </span>
      </HistoryItemHeader>
      <HistoryItemBody>
        {renderHistoryItemBody({ action, actionDescription, groupDate })}
      </HistoryItemBody>
    </HistoryItem>
  );

  const renderHistoryItems = () => {
    const result = [];

    for (const [date, historyItems] of historyMap.entries()) {
      result.push(
        <HistoryItems key={`group-${date}`}>
          <p className="bold">{formatDateDisplay(date)}</p>
          <>
            {historyItems.map((historyItem, index) =>
              renderHistoryItem(historyItem, date, index),
            )}
          </>
        </HistoryItems>,
      );
    }

    return result;
  };

  useEffect(() => {
    logEvent('History tab open', {
      issue_key: selectedIssue.key,
      risks_count: selectedIssue.cnt,
      tab_name: selectedIssue.status_name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Container>{renderHistoryItems()}</Container>;
};

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
`;

const HistoryItems = styled.div`
  display: flex;
  flex-flow: column nowrap;
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 400;
  color: #484848;
  width: 100%;
  margin-bottom: 20px;

  .bold {
    font-weight: 800;
  }

  > p {
    width: 100%;
    text-align: center;
    color: #858585;
    margin-bottom: 5px;
  }
`;

const HistoryItem = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  margin-bottom: 5px;
`;

const HistoryItemHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 6px;

  .timespent {
    margin-left: auto;
    margin-right: 15px;
  }
`;

const HistoryItemBody = styled.div`
  width: calc(100% - 80px);
  display: flex;
  flex-flow: column nowrap;
  margin-left: 40px;
  margin-top: 5px;
`;

export default HistoryTab;

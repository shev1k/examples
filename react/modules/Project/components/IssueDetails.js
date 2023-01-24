/* eslint-disable react-hooks/exhaustive-deps */
import RSort from 'ramda/es/sort';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import ActionsTab from '../tabs/ActionsTab';
import DetailsTab from '../tabs/DetailsTab';
import HistoryTab from '../tabs/HistoryTab';
import CloseIcon from 'src/assets/icons/CloseIcon.png';
import {
  riskIdsGraphOrder,
  riskGroupMapping,
  strikeIdsGraphOrder,
  strikeIdsDescriptionMapping,
  visibleIncompleteStrikesByCategory,
  actionsDescriptionMapping,
  actionsToRiskMapping,
  fakeActionsMapping,
  ACTION_CHANGE_TYPE,
} from 'src/constants/constants';
import { logEvent } from 'src/config/amplitude';

const TABS = {
  ACTIONS: 'actionsTab',
  DETAILS: 'detailsTab',
  HISTORY: 'historyTab',
};

const ACTION_TYPE = {
  ADDED: 'added',
  CHANGED: 'changed',
  REMOVED: 'removed',
  CLOSED: 'closed',
  PUSHED: 'pushed',
  SENT: 'sent',
};

const ACTION_DISPLAY_TYPE = {
  ROW: 'row',
  COLUMN: 'column',
};

const formatTimeEstimate = (seconds = 0) => {
  if (seconds < 3600) {
    return Math.round(seconds / 60) + 'm';
  }

  const hours = seconds / 3600;

  if (Number.isInteger(hours)) {
    return hours + 'h';
  }

  return hours.toFixed(1) + 'h';
};

const IssueDetails = ({ selectedIssue, handleClose }) => {
  const [tab, setTab] = useState(TABS.ACTIONS);

  const handleTabClick = (tabName) => () => {
    setTab(tabName);
  };

  const orderGraphData = (arr, order) => {
    const result = [];

    for (const item of arr) {
      const index = order[item.id];
      result[index] = item;
    }

    return result.filter(Boolean);
  };

  const convertHistoryToMap = (activityHistory) => {
    const timeline = activityHistory.reduce((timelineMap, historyItem) => {
      const [date] = historyItem.change_time.split(' ');

      if (!timelineMap.get(date)) {
        timelineMap.set(date, []);
      }
      timelineMap.get(date).push(historyItem);

      return timelineMap;
    }, new Map());

    for (const [date, historyItems] of timeline.entries()) {
      const sortedHistoryItems = RSort(
        ({ change_time: t1 }, { change_time: t2 }) => {
          return Number(new Date(t2)) - Number(new Date(t1));
        },
        historyItems,
      );

      timeline.set(date, sortedHistoryItems);
    }

    return new Map(
      Array.from(timeline).sort(([date1], [date2]) => {
        return Number(new Date(date2)) - Number(new Date(date1));
      }),
    );
  };

  const getActionType = ({ prev_value, new_value }) => {
    if (!prev_value && new_value) {
      return ACTION_TYPE.ADDED;
    }

    if (prev_value && new_value) {
      return ACTION_TYPE.CHANGED;
    }

    if (prev_value && !new_value) {
      return ACTION_TYPE.REMOVED;
    }

    return 'n.a';
  };

  const normalizeHistoryItem = (historyItem) => {
    const { change_author, change_time, change_type, new_value, prev_value } =
      historyItem;

    switch (change_type) {
      case ACTION_CHANGE_TYPE.RISK_ADDED: {
        const riskId = Number(new_value);
        const riskCategory = riskGroupMapping[riskId];

        return {
          author: 'azimu',
          action: ACTION_CHANGE_TYPE.RISK_ADDED,
          actionType: ACTION_TYPE.ADDED,
          actionScope: riskCategory + ' Risk',
          actionTime: change_time,
          actionDescription: {
            display: ACTION_DISPLAY_TYPE.ROW,
            body: [prev_value],
          },
        };
      }

      case ACTION_CHANGE_TYPE.RISK_CLOSED: {
        const riskId = Number(new_value);
        const riskCategory = riskGroupMapping[riskId];

        return {
          author: 'azimu',
          action: ACTION_CHANGE_TYPE.RISK_CLOSED,
          actionType: ACTION_TYPE.CLOSED,
          actionScope: riskCategory + ' Risk',
          actionTime: change_time,
          actionDescription: {
            display: ACTION_DISPLAY_TYPE.ROW,
            body: [prev_value],
          },
        };
      }

      case ACTION_CHANGE_TYPE.DESCRIPTION: {
        return {
          author: change_author,
          action: ACTION_CHANGE_TYPE.DESCRIPTION,
          actionType: getActionType({ prev_value, new_value }),
          actionScope: 'Description',
          actionTime: change_time,
          actionDescription: {
            display: ACTION_DISPLAY_TYPE.COLUMN,
            body: [prev_value, new_value],
          },
        };
      }

      case ACTION_CHANGE_TYPE.STATUS: {
        return {
          author: change_author,
          action: ACTION_CHANGE_TYPE.STATUS,
          actionType: ACTION_TYPE.CHANGED,
          actionScope: 'Status',
          actionTime: change_time,
          actionDescription: {
            display: ACTION_DISPLAY_TYPE.ROW,
            body: [prev_value, new_value],
          },
        };
      }

      case ACTION_CHANGE_TYPE.ASSIGNEE: {
        return {
          author: change_author,
          action: ACTION_CHANGE_TYPE.ASSIGNEE,
          actionType: ACTION_TYPE.CHANGED,
          actionScope: 'Assignee',
          actionTime: change_time,
          actionDescription: {
            display: ACTION_DISPLAY_TYPE.ROW,
            body: [prev_value || 'n.a', new_value || 'n.a'],
          },
        };
      }

      case ACTION_CHANGE_TYPE.TIMEORIGINALESTIMATE: {
        return {
          author: change_author,
          action: ACTION_CHANGE_TYPE.TIMEORIGINALESTIMATE,
          actionType: ACTION_TYPE.CHANGED,
          actionScope: 'Original Estimate',
          actionTime: change_time,
          actionDescription: {
            display: ACTION_DISPLAY_TYPE.ROW,
            body: [
              formatTimeEstimate(prev_value),
              formatTimeEstimate(new_value),
            ],
          },
        };
      }

      case ACTION_CHANGE_TYPE.SPRINT: {
        let actionScope = null;
        let actionType = null;

        const next = new_value?.split(',').slice(-1);

        if (!prev_value && new_value) {
          actionType = 'added issue to';
          actionScope = `${next}`;
        }

        if (prev_value && new_value) {
          actionType = 'moved issue to';
          actionScope = `${next}`;
        }

        if (prev_value && !new_value) {
          actionType = 'moved issue to';
          actionScope = `Backlog`;
        }

        return {
          author: change_author,
          action: ACTION_CHANGE_TYPE.SPRINT,
          actionType,
          actionScope,
          actionTime: change_time,
          actionDescription: {
            display: ACTION_DISPLAY_TYPE.ROW,
            body: [],
          },
        };
      }

      case ACTION_CHANGE_TYPE.COMMIT: {
        const repo = '@' + prev_value;
        const bodyMessage = repo + ' | ' + new_value;

        let actionScope = 'Commit';

        if (new_value.includes('Merge-branch')) {
          actionScope = 'Merge Request'
        }


        return {
          author: change_author,
          action: ACTION_CHANGE_TYPE.COMMIT,
          actionType: ACTION_TYPE.PUSHED,
          actionScope,
          actionTime: change_time,
          actionDescription: {
            display: ACTION_DISPLAY_TYPE.ROW,
            body: [bodyMessage],
          },
        };
      }

      case ACTION_CHANGE_TYPE.COMMENT: {
        return {
          author: change_author,
          action: ACTION_CHANGE_TYPE.COMMENT,
          actionType: ACTION_TYPE.ADDED,
          actionScope: 'Jira Comment',
          actionTime: change_time,
          actionDescription: {
            display: ACTION_DISPLAY_TYPE.ROW,
            body: [prev_value, new_value].filter(Boolean),
          },
        };
      }

      case ACTION_CHANGE_TYPE.TIMESPENT: {
        return {
          author: change_author,
          action: ACTION_CHANGE_TYPE.TIMESPENT,
          actionType: ACTION_TYPE.CHANGED,
          actionScope: 'Logged time',
          actionTime: change_time,
          actionDescription: {
            display: ACTION_DISPLAY_TYPE.ROW,
            body: [
              formatTimeEstimate(prev_value),
              formatTimeEstimate(new_value),
            ],
          },
        };
      }

      case ACTION_CHANGE_TYPE.ACCEPTANCE_CRITERIA: {
        return {
          author: change_author,
          action: ACTION_CHANGE_TYPE.ACCEPTANCE_CRITERIA,
          actionType: getActionType({ prev_value, new_value }),
          actionScope: 'Acceptance Criteria',
          actionTime: change_time,
          actionDescription: {
            display: ACTION_DISPLAY_TYPE.COLUMN,
            body: [prev_value, new_value],
          },
        };
      }

      case ACTION_CHANGE_TYPE.MESSAGE: {
        return {
          author: change_author,
          action: ACTION_CHANGE_TYPE.MESSAGE,
          actionType: ACTION_TYPE.SENT,
          actionScope: 'Slack Message',
          actionTime: change_time,
          actionDescription: {
            display: ACTION_DISPLAY_TYPE.ROW,
            body: [new_value],
          },
        };
      }

      default: {
        return null;
      }
    }
  };

  const getHistoryTimeline = () => {
    const { activity_history } = selectedIssue;
    const historyMap = convertHistoryToMap(activity_history);

    for (const [date, historyItems] of historyMap.entries()) {
      historyMap.set(
        date,
        historyItems.map(normalizeHistoryItem).filter(Boolean),
      );
    }

    return historyMap;
  };

  const normalizeGraphData = () => {
    const { risks, strikes, status_category_name, key } = selectedIssue;
    const risk_items = risks.map(({ risk_id, short_description }) => ({
      id: Number(risk_id),
      description: short_description,
    }));
    const completed_strike_items = strikes.map(({ event_value }) => ({
      id: Number(event_value),
      description: strikeIdsDescriptionMapping[Number(event_value)],
    }));

    const visibleIncompleteStrikes =
      visibleIncompleteStrikesByCategory[status_category_name];
    const completed_strike_ids = completed_strike_items.map(({ id }) => id);
    const incomplete_strike_items = Object.keys(strikeIdsGraphOrder).reduce(
      (acc, strikeId) => {
        const id = Number(strikeId);
        if (
          visibleIncompleteStrikes.includes(id) &&
          !completed_strike_ids.includes(id)
        ) {
          acc.push({
            id,
            description: strikeIdsDescriptionMapping[strikeId],
          });
        }

        return acc;
      },
      [],
    );

    const ordered_risks = orderGraphData(risk_items, riskIdsGraphOrder);
    const ordered_completed_strikes = orderGraphData(
      completed_strike_items,
      strikeIdsGraphOrder,
    );
    const ordered_incomplete_strikes = orderGraphData(
      incomplete_strike_items,
      strikeIdsGraphOrder,
    );

    const uniqActions =
      fakeActionsMapping[key] ||
      Array.from(
        new Set(
          risk_items
            .reduce((acc, r) => {
              acc.push(actionsToRiskMapping[r.id] || []);
              return acc;
            }, [])
            .flat(),
        ),
      );

    const actions = uniqActions.map((actionId) => ({
      id: actionId,
      description: actionsDescriptionMapping[actionId],
      onClick: () => {},
    }));

    return {
      actions: actions,
      completed_strikes: ordered_completed_strikes,
      incomplete_strikes: ordered_incomplete_strikes,
      risks: ordered_risks,
    };
  };

  const renderTabContent = () => {
    const { description, summary } = selectedIssue;

    switch (tab) {
      case TABS.ACTIONS: {
        const { actions, completed_strikes, incomplete_strikes, risks } =
          normalizeGraphData();

        return (
          <ActionsTab
            actions={actions}
            completed_strikes={completed_strikes}
            incomplete_strikes={incomplete_strikes}
            risks={risks}
            isDone={selectedIssue.status_category_name === 'Done'}
          />
        );
      }

      case TABS.DETAILS: {
        return <DetailsTab description={description} summary={summary} />;
      }

      case TABS.HISTORY: {
        const historyMap = getHistoryTimeline();

        return (
          <HistoryTab selectedIssue={selectedIssue} historyMap={historyMap} />
        );
      }

      default: {
        return null;
      }
    }
  };

  useEffect(() => {
    return () => {
      logEvent('Risks/history tab closed');
    };
  }, []);

  return (
    <Container>
      <Content>
        <Heading>
          <TabsContainer>
            <Tab
              selected={tab === TABS.ACTIONS}
              onClick={handleTabClick(TABS.ACTIONS)}
            >
              Actions
            </Tab>

            <Tab
              selected={tab === TABS.DETAILS}
              onClick={handleTabClick(TABS.DETAILS)}
            >
              Details
            </Tab>
            <Tab
              selected={tab === TABS.HISTORY}
              onClick={handleTabClick(TABS.HISTORY)}
            >
              History
            </Tab>
          </TabsContainer>
          <CloseButton
            style={{ width: 15, height: 15 }}
            src={CloseIcon}
            onClick={handleClose}
          />
        </Heading>
        <TabContent>{renderTabContent()}</TabContent>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 40%;
  max-width: 40%;
  min-width: 40%;
  position: sticky;
  top: 0;
  left: 0;
  height: fit-content;
  min-height: 300px;
`;

const Content = styled.div`
  margin-left: 10px;
  padding: 10px 15px;
  border: 1px solid #dfdfdf;
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  min-height: 300px;
  background: #fff;
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const TabsContainer = styled.div`
  margin-bottom: 10px;
`;

const Tab = styled.span`
  margin-right: 20px;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 500;
  color: #484848;
  cursor: pointer;

  ${({ selected }) => {
    if (selected) {
      return `
        font-weight: bold;
        text-decoration: underline;
      `;
    }
  }}
`;

const TabContent = styled.div`
  max-height: calc(74vh + 2px);
  overflow-y: auto;
`;

const CloseButton = styled.img`
  text-align: right;
  margin: 0 0 0 auto;
  cursor: pointer;
  display: ROW-block;
`;

export default IssueDetails;

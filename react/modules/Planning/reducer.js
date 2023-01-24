import RAssoc from 'ramda/es/assoc';
import RPath from 'ramda/es/path';
import RPipe from 'ramda/es/pipe';

import {
  SET_BENCHMARK,
  SET_BOARD,
  UPDATE_BOARD,
  UPDATE_FILTER,
  SET_SELECTED_ISSUE,
  CLEAR_SELECTED_ISSUE,
} from './constants';

const initialState = {
  benchmark: null,
  board: null,
  filter: null,
  selectedIssue: null,
};

const filterKeys = [
  'summary',
  'issuetype_name',
  'key',
  'assignee_displayname',
  'epic_link_name',
];

const toMap = (columns) => {
  const ids = columns.map((col) => String(col.id));

  return ids.reduce((acc, id, index) => {
    acc[String(id)] = columns[index];

    return acc;
  }, {});
};

const fromMap = (columns) => Object.values(columns);

const getAverageBenchmark = (sprints) => {
  const {
    startTicketsCount,
    resolvedTime,
    resolvedIssues,
    tooBigRisks,
    noEstimateRisks,
    noDescriptionRisks,
    descriptionUpdateRate,
  } = sprints.reduce(
    (
      acc,
      {
        start_avg_descr_upd,
        start_tickets_cnt,
        start_is_too_big,
        start_is_no_est,
        start_is_no_descr,
        now_planned_resolved_cnt,
        closed_planned_total_estimate,
      },
    ) => {
      acc.resolvedIssues += now_planned_resolved_cnt || 0;
      acc.startTicketsCount += start_tickets_cnt || 0;
      acc.tooBigRisks += start_is_too_big || 0;
      acc.noEstimateRisks += start_is_no_est || 0;
      acc.noDescriptionRisks += start_is_no_descr || 0;
      acc.descriptionUpdateRate += start_avg_descr_upd || 0;
      acc.resolvedTime += closed_planned_total_estimate;

      return acc;
    },
    {
      startTicketsCount: 0,
      resolvedTime: 0,
      resolvedIssues: 0,
      tooBigRisks: 0,
      noEstimateRisks: 0,
      noDescriptionRisks: 0,
      descriptionUpdateRate: 0,
    },
  );

  return {
    resolvedTime: Math.ceil(resolvedTime / 3600 / sprints.length),
    resolvedIssues: parseFloat(resolvedIssues / sprints.length),
    tooBigRisks: Math.ceil((tooBigRisks / startTicketsCount) * 100),
    noEstimateRisks: Math.ceil((noEstimateRisks / startTicketsCount) * 100),
    noDescriptionRisks: Math.ceil(
      (noDescriptionRisks / startTicketsCount) * 100,
    ),
    descriptionUpdateRate: parseFloat(
      (descriptionUpdateRate / sprints.length).toFixed(2),
    ),
  };
};

const filterBoard = ({ board: boardMap, filter = '' }) => {
  const board = fromMap(boardMap);

  const updatedBoard = board.map((column) => {
    const { issues } = column;
    const updatedIssues = issues.map((issue) => {
      const { subtasks } = issue;
      const matchedParent = filterKeys.some((filterKey) => {
        const val = (issue[filterKey] || '').toLowerCase();

        return val.includes(filter.toLowerCase());
      });

      const matchedSubtasks = filterKeys.some((filterKey) => {
        for (const subtask of subtasks) {
          console.log(subtask);
          const val = (subtask[filterKey] || '').toLowerCase();

          if (val.includes(filter.toLowerCase())) {
            return true;
          }
        }

        return false;
      });

      const isHidden = !(matchedParent || matchedSubtasks);

      // issue that is not matched with filter keys is gonna be hidden
      return { ...issue, isHidden };
    });

    return { ...column, issues: updatedIssues };
  });

  return toMap(updatedBoard);
};

const planningReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_BENCHMARK: {
      const { sprints } = payload;
      const benchmark = getAverageBenchmark(sprints);

      return RAssoc('benchmark', benchmark, state);
    }

    case SET_BOARD: {
      const { board } = payload;

      return RAssoc(
        'board',
        toMap(
          board.map((column) => {
            const { issues } = column;
            const moddedIssues = issues.map((issue) => ({
              ...issue,
              isHidden: false,
            }));

            return RAssoc('issues', moddedIssues, column);
          }),
        ),
        state,
      );
    }

    case UPDATE_BOARD: {
      const { board } = payload;

      return RAssoc('board', board, state);
    }

    case UPDATE_FILTER: {
      const { board } = state;
      const { filter } = payload;

      const nextBoard = filterBoard({ board, filter });
      const nextState = RPipe(
        RAssoc('filter', filter),
        RAssoc('board', nextBoard),
      )(state);

      return nextState;
    }

    case SET_SELECTED_ISSUE: {
      const { selectedIssue } = payload;

      return RAssoc('selectedIssue', selectedIssue, state);
    }

    case CLEAR_SELECTED_ISSUE: {
      return RAssoc('selectedIssue', null, state);
    }

    default: {
      return state;
    }
  }
};

export const getBenchmark = RPath(['planning', 'benchmark']);
export const getBoard = RPath(['planning', 'board']);
export const getFilter = RPath(['planning', 'filter']);
export const getSelectedIssue = RPath(['planning', 'selectedIssue']);

export default planningReducer;

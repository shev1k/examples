import {
  SET_BENCHMARK,
  SET_BOARD,
  UPDATE_BOARD,
  UPDATE_FILTER,
  SET_SELECTED_ISSUE,
  CLEAR_SELECTED_ISSUE,
} from './constants';

export const setBenchmark = ({ sprints }) => ({
  type: SET_BENCHMARK,
  payload: {
    sprints,
  },
});

export const setBoard = ({ board }) => ({
  type: SET_BOARD,
  payload: { board },
});

export const updateBoard = ({ board }) => ({
  type: UPDATE_BOARD,
  payload: { board },
});

export const updateFilter = ({ filter }) => ({
  type: UPDATE_FILTER,
  payload: { filter },
});

export const setSelectedIssue = ({ selectedIssue }) => ({
  type: SET_SELECTED_ISSUE,
  payload: { selectedIssue },
});

export const clearSelectedIssue = () => ({
  type: CLEAR_SELECTED_ISSUE,
});

import assoc from 'ramda/es/assoc';
import pathOr from 'ramda/es/pathOr';
import {
  SET_RISKS,
  SET_CURRENT_RISKS,
  SET_SPRINTS,
  SET_SELECTED_PROJECT,
  RESET_STATE,
  SET_SORT,
} from './constants';

const initialState = {
  selectedProject: {},
  sprints: [],
  risks: [],
  selectedSort: null,
  currentRisks: {
    clarity: {},
    code: {},
    focus: {},
    issuesAtRisk: {},
  },
};

const formatCurrentRisks = (currentRisks) =>
  currentRisks.reduce((acc, currentRisk) => {
    if (currentRisk.clarity) {
      acc.clarity = currentRisk.clarity;
    }

    if (currentRisk.code) {
      acc.code = currentRisk.code;
    }

    if (currentRisk.focus) {
      acc.focus = currentRisk.focus;
    }

    if (currentRisk.issues_at_risk) {
      acc.issuesAtRisk = currentRisk.issues_at_risk;
    }

    return acc;
  }, {});

const projectReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_SELECTED_PROJECT: {
      const { selectedProject } = payload;

      return { selectedProject, sprints: [], risks: [], currentRisks: [] };
    }

    case SET_SPRINTS: {
      const { sprints } = payload;

      return assoc('sprints', sprints, state);
    }

    case SET_RISKS: {
      const { risks } = payload;

      return assoc('risks', risks, state);
    }

    case SET_CURRENT_RISKS: {
      const { currentRisks } = payload;

      return assoc('currentRisks', formatCurrentRisks(currentRisks), state);
    }

    case RESET_STATE: {
      return initialState;
    }

    case SET_SORT: {
      const { selectedSort } = payload;

      return assoc('selectedSort', selectedSort, state);
    }

    default: {
      return state;
    }
  }
};

export const selectedProjectSelector = pathOr(null, [
  'project',
  'selectedProject',
]);
export const sprintsSelector = pathOr([], ['project', 'sprints']);
export const risksSelector = pathOr([], ['project', 'risks']);
export const currentRisksSelector = pathOr([], ['project', 'currentRisks']);
export const selectedSortSelector = pathOr(null, ['project', 'selectedSort']);

export default projectReducer;

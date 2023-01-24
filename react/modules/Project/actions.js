import {
  SET_SELECTED_PROJECT,
  SET_RISKS,
  SET_CURRENT_RISKS,
  SET_SPRINTS,
  RESET_STATE,
  SET_SORT,
} from './constants';

export const setSelectedProject = ({ selectedProject }) => ({
  type: SET_SELECTED_PROJECT,
  payload: {
    selectedProject,
  },
});

export const setRisks = ({ risks }) => ({
  type: SET_RISKS,
  payload: {
    risks,
  },
});

export const setCurrentRisks = ({ currentRisks }) => ({
  type: SET_CURRENT_RISKS,
  payload: {
    currentRisks,
  },
});

export const setSprints = ({ sprints }) => ({
  type: SET_SPRINTS,
  payload: {
    sprints,
  },
});

export const resetProjectReducerState = () => ({
  type: RESET_STATE,
});

export const setSelectedSort = ({ selectedSort }) => ({
  type: SET_SORT,
  payload: {
    selectedSort,
  },
});

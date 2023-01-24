import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import ProjectSelect from 'src/components/ProjectSelect';
import Board from '../components/Board';
import { selectedProjectSelector } from 'src/modules/Project/reducer';
import {
  setBenchmark as setBenchmarkAction,
  setBoard as setBoardAction,
  clearSelectedIssue as clearSelectedIssueAction,
} from '../actions';
import { client } from 'src/services/client';

const SPRINT_AVERAGE_COUNT = 5;

const filterSprints = (sprints) => {
  const result = sprints.filter((s) => s.sprint_state === 'closed');

  return result.slice(0, 5);
};

const PlanningPage = () => {
  const dispatch = useDispatch();
  const currentProjectKey = useSelector(selectedProjectSelector);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const setBenchmarkData = useCallback(
    ({ sprints }) => dispatch(setBenchmarkAction({ sprints })),
    [dispatch],
  );

  const setBoardColumns = useCallback(
    ({ board }) => dispatch(setBoardAction({ board })),
    [dispatch],
  );

  const clearSelectedIssue = useCallback(
    () => dispatch(clearSelectedIssueAction()),
    [dispatch],
  );

  const fetchSprints = useCallback(() => {
    const params = {
      project_key: currentProjectKey.label,
      limit: SPRINT_AVERAGE_COUNT + 3,
    };

    return client.get('/sprint_stats', { params }).then((response) => {
      const { data, success } = response.data;

      return { data: filterSprints(data), success };
    });
  }, [currentProjectKey]);

  const fetchBoard = useCallback(() => {
    const params = {
      project_key: currentProjectKey.label,
    };

    return client.get('/issues_for_planning', { params }).then((response) => {
      const { data, success } = response.data;
      return { success, data };
    });
  }, [currentProjectKey]);

  const fetchData = useCallback(async () => {
    if (currentProjectKey.label) {
      setLoading(true);
      setError(false);

      try {
        const [sprints, board] = await Promise.all([
          fetchSprints(),
          fetchBoard(),
        ]);

        if (sprints.success && board.success) {
          setBenchmarkData({ sprints: sprints.data });
          setBoardColumns({ board: board.data });

          setLoading(false);
        }
      } catch (err) {
        console.log(err);

        setError(true);
        setLoading(false);
      }
    }
  }, [
    currentProjectKey,
    fetchSprints,
    fetchBoard,
    setBenchmarkData,
    setBoardColumns,
  ]);

  useEffect(() => {
    clearSelectedIssue();
    fetchData();
  }, [currentProjectKey, fetchData, clearSelectedIssue]);

  return (
    <div>
      <ProjectSelect />
      {loading || error ? (
        <LoaderContainer>
          <CircularProgress />
        </LoaderContainer>
      ) : (
        <Board SPRINT_AVERAGE_COUNT={SPRINT_AVERAGE_COUNT} />
      )}
    </div>
  );
};

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
`;

export default PlanningPage;

import RAssoc from 'ramda/es/assoc';
import RGroupBy from 'ramda/es/groupBy';
import RSort from 'ramda/es/sort';
import RUniq from 'ramda/es/uniq';
import RPipe from 'ramda/es/pipe';
import RPick from 'ramda/es/pick';
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  memo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ProjectRisksTables from './ProjectRisksTables';
import { logEvent } from 'src/config/amplitude';
import { setIssueStatusNameColorMap as setIssueStatusNameColorMapAction } from 'src/modules/Mappings/actions';
import { selectedProjectSelector } from 'src/modules/Project/reducer';
import { jiraStatusCategoryColorMapping } from 'src/constants/constants';
import {
  applyOrderFromLocalStorage,
  setOrderToLocalStorage,
} from '../orderUtils';

const STATUS_NAME = 'status_name';

const initialSort = { sortBy: 'cnt', isDesc: true };

const issueSearchKeys = ['issuetype_name', 'key', 'summary'];

const ProjectRisksTableWrapper = ({ initialData }) => {
  const [forceUpdate, setForceUpdate] = useState(0);
  const dispatch = useDispatch();
  const selectedProject = useSelector(selectedProjectSelector);
  const intervalId = useRef(null);

  const forceUpdateInitialDataReinit = () => setForceUpdate((prev) => prev + 1);

  const setIssueStatusNameColorMap = useCallback(
    ({ statusColorMap }) =>
      dispatch(setIssueStatusNameColorMapAction({ statusColorMap })),
    [dispatch],
  );

  const normalizeIssue = useCallback((issue) => {
    const { subtasks } = issue;

    const subtasksTotalEstimate = subtasks.reduce((acc, s) => {
      acc += s.timeoriginalestimate;
      return acc;
    }, 0);

    return {
      ...issue,
      cnt: issue.risks.length,
      timeoriginalestimate: issue.timeoriginalestimate + subtasksTotalEstimate,
    };
  }, []);

  const withParentDuplicates = useCallback((issues) => {
    const issuesWithDuplicates = [];

    for (const issue of issues) {
      const { subtasks } = issue;
      const statuses = [
        ...subtasks.map((subtask) => subtask[STATUS_NAME]),
        issue[STATUS_NAME],
      ];
      const uniqStatuses = RUniq(statuses);

      for (const uniqStatus of uniqStatuses) {
        const filteredSubtasks = subtasks.filter(
          (subtask) => subtask[STATUS_NAME] === uniqStatus,
        );

        const updatedIssue = {
          ...issue,
          [STATUS_NAME]: uniqStatus,
          subtasks: filteredSubtasks,
          isDuplicate: uniqStatus !== issue[STATUS_NAME],
        };

        issuesWithDuplicates.push(updatedIssue);
      }
    }

    return issuesWithDuplicates;
  }, []);

  const withSubtasks = useCallback(
    (issues) => {
      const subtasksMap = {};

      for (const issue of issues) {
        if (issue.issuetype_subtask) {
          if (!subtasksMap[issue.parent_key]) {
            subtasksMap[issue.parent_key] = [];
          }
          subtasksMap[issue.parent_key].push(issue);
        }
      }

      const issuesWithSubtasks = [];

      for (const issue of issues) {
        if (!issue.issuetype_subtask) {
          const subtasks = subtasksMap[issue.key] || [];
          issuesWithSubtasks.push(normalizeIssue({ ...issue, subtasks }));
        }
      }

      return issuesWithSubtasks;
    },
    [normalizeIssue],
  );

  const groupDataByStatus = useCallback(
    (data) => {
      const groups = RGroupBy((issue) => issue[STATUS_NAME], data);
      const groupNamesWithCategory = initialData.reduce(
        (statusesMap, issue) => {
          if (!statusesMap[issue[STATUS_NAME]]) {
            statusesMap[issue[STATUS_NAME]] =
              jiraStatusCategoryColorMapping[issue.status_category_name];
          }

          return statusesMap;
        },
        {},
      );

      setIssueStatusNameColorMap({ statusColorMap: groupNamesWithCategory });

      return Object.entries(groups).map(([groupName, groupData], index) => ({
        groupName,
        groupNamesWithCategory,
        issues: groupData,
        order: index,
      }));
    },
    [initialData, setIssueStatusNameColorMap],
  );
  const normalizeData = useCallback(
    (initialData) =>
      RPipe(
        withSubtasks,
        withParentDuplicates,
        groupDataByStatus,
        applyOrderFromLocalStorage(selectedProject),
      )(initialData),
    [groupDataByStatus, withSubtasks, selectedProject, withParentDuplicates],
  );

  const normalizedInitialData = useMemo(
    () => normalizeData(initialData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialData, normalizeData, forceUpdate],
  );
  const displayNames = useMemo(
    () =>
      normalizedInitialData.reduce((assignees, group) => {
        for (const { assignee_displayname } of group.issues) {
          if (
            assignee_displayname &&
            !assignees.includes(assignee_displayname)
          ) {
            assignees.push(assignee_displayname);
          }
        }

        return assignees;
      }, []),
    [normalizedInitialData],
  );
  const [visibleData, setVisibleData] = useState(normalizedInitialData);
  const [sort, setSort] = useState(initialSort);
  const [search, setSearch] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedAssignees, setSelectedAssignees] = useState([]);

  const handleSearchChange = useCallback((search) => {
    // Debounce for event log
    clearInterval(intervalId.current);
    intervalId.current = setTimeout(() => {
      logEvent('Filtering project table', {
        search_query: search,
      });
    }, 1000);

    setSearch(search);
  }, []);

  const matchQuery = useCallback(
    (issue, query, matchKeys = issueSearchKeys) => {
      const filter = query.toLowerCase();

      for (const key of matchKeys) {
        const issueValue = (issue[key] || '').toLowerCase();

        if (issueValue !== '' && issueValue.includes(filter)) {
          return true;
        }
      }

      return false;
    },
    [],
  );

  const filterAssignees = useCallback(
    (groups) => {
      return groups.map((group) => {
        const { issues } = group;

        if (selectedAssignees.length === 0) return group;

        const filteredIssues = issues.reduce((acc, issue) => {
          const { subtasks } = issue;
          const parentMatched = selectedAssignees.includes(
            issue.assignee_displayname,
          );
          const filteredSubtasks = subtasks.filter((subtask) =>
            selectedAssignees.includes(subtask.assignee_displayname),
          );
          const subtasksMatched = filteredSubtasks.length > 0;

          if (parentMatched || subtasksMatched) {
            acc.push(RAssoc('subtasks', filteredSubtasks, issue));
          }

          return acc;
        }, []);

        return RAssoc('issues', filteredIssues, group);
      });
    },
    [selectedAssignees],
  );

  const filterSearch = useCallback(
    (groups) => {
      return groups.map((group) => {
        const { issues } = group;

        const filteredIssues = issues.reduce((acc, issue) => {
          const { subtasks } = issue;
          const parentMatched = matchQuery(issue, search);
          const filteredSubtasks = subtasks.filter((subtask) =>
            matchQuery(subtask, search),
          );
          const subtasksMatched = filteredSubtasks.length > 0;

          if (parentMatched || subtasksMatched) {
            acc.push(RAssoc('subtasks', subtasks, issue));
          }

          return acc;
        }, []);

        return RAssoc('issues', filteredIssues, group);
      });
    },
    [matchQuery, search],
  );

  const sortFn = useCallback(
    ({ data, sortBy, isDesc }) =>
      RSort((a, b) => {
        const first = isDesc ? b[sortBy] : a[sortBy];
        const second = isDesc ? a[sortBy] : b[sortBy];

        if (typeof first === 'string') {
          return first.localeCompare(second);
        }

        return first - second;
      }, data),
    [],
  );

  const sortData = useCallback(
    (groups) => {
      const { sortBy, isDesc } = sort;

      return groups.map((group) => {
        const { issues } = group;

        const sortedIssues = sortFn({ data: issues, sortBy, isDesc }).map(
          (issue) => {
            const { subtasks } = issue;
            const sortedSubtasks = sortFn({ data: subtasks, sortBy, isDesc });

            return RAssoc('subtasks', sortedSubtasks, issue);
          },
        );

        return RAssoc('issues', sortedIssues, group);
      });
    },
    [sort, sortFn],
  );

  const handleOrderChange = useCallback(
    (currentGroupName) =>
      ({ target: { value: selectedGroupName } }) => {
        logEvent('Project tab changed', {
          prev_tab: currentGroupName,
          next_tab: selectedGroupName,
        });

        const { current, selected } = normalizedInitialData.reduce(
          (acc, d) => {
            if (d.groupName === currentGroupName) {
              acc.current = d;
            }
            if (d.groupName === selectedGroupName) {
              acc.selected = d;
            }
            return acc;
          },
          { current: null, selected: null },
        );

        const result = normalizedInitialData.reduce((acc, d) => {
          if (d.groupName === current.groupName) {
            acc.push({ ...d, order: selected.order });
            return acc;
          }

          if (d.groupName === selected.groupName) {
            acc.push({ ...d, order: current.order });
            return acc;
          }

          acc.push(d);
          return acc;
        }, []);

        const tableOrder = result.reduce((acc, val) => {
          acc.push(RPick(['order', 'groupName'], val));
          return acc;
        }, []);

        setOrderToLocalStorage(selectedProject.id, tableOrder);
        forceUpdateInitialDataReinit();
      },
    [normalizedInitialData, selectedProject.id],
  );

  const handleSortClick = useCallback(
    ({ sortBy: nextSortBy }) =>
      () => {
        const { sortBy: currentSortBy, isDesc: currentIsDesc } = sort;
        const nextSortState = {
          sortBy: nextSortBy,
          isDesc: true,
        };

        if (nextSortBy === currentSortBy) {
          nextSortState.isDesc = !currentIsDesc;
        }

        logEvent('Sorting project table', nextSortState);

        setSort(nextSortState);
      },
    [sort],
  );

  const handleIssueSelect = useCallback(
    (d) => {
      if (selectedIssue && d.key === selectedIssue.key) {
        setSelectedIssue(null);
      } else {
        setSelectedIssue(d);
      }
    },
    [selectedIssue],
  );

  const handleDetailsClose = useCallback(() => {
    setSelectedIssue(null);
  }, []);

  const handleKeyDown = (event) => {
    if (event.code === 'Escape') {
      setSelectedIssue(null);
    }
  };

  const updateAssignees = useCallback((nextAssignees) => {
    setSelectedAssignees(nextAssignees);
  }, []);

  const sortGroupByOrder = RSort((a, b) => a.order - b.order);

  const applyDataBuild = RPipe(
    filterSearch,
    filterAssignees,
    sortData,
    sortGroupByOrder,
  );

  const timeoutId = useRef(null);

  useEffect(() => {
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      setVisibleData(applyDataBuild(normalizedInitialData));
    }, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sort, selectedAssignees, normalizedInitialData]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ProjectRisksTables
      visibleData={visibleData}
      sort={sort}
      search={search}
      selectedIssue={selectedIssue}
      selectedAssignees={selectedAssignees}
      displayNames={displayNames}
      updateAssignees={updateAssignees}
      handleSearchChange={handleSearchChange}
      handleSortClick={handleSortClick}
      handleIssueSelect={handleIssueSelect}
      handleDetailsClose={handleDetailsClose}
      handleOrderChange={handleOrderChange}
    />
  );
};

export default memo(ProjectRisksTableWrapper);

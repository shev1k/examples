import React, { memo } from 'react';
import styled from 'styled-components';

import Filter from 'src/components/TableFilter';
import IssueDetails from '../components/IssueDetails';
import AssigneesFilter from '../components/AssigneesFilter';
import ProjectRisksTableHeader from './ProjectRisksTableHeader';
import ProjectRisksTable from './ProjectRisksTable';

const ProjectRisksTables = ({
  visibleData,
  sort,
  search,
  selectedIssue,
  selectedAssignees,
  displayNames,
  updateAssignees,
  handleSearchChange,
  handleSortClick,
  handleIssueSelect,
  handleDetailsClose,
  handleOrderChange,
}) => {
  const renderTables = () =>
    visibleData
      .sort((a, b) => a.order - b.order)
      .map((d) => (
        <ProjectRisksTable
          handleIssueSelect={handleIssueSelect}
          handleOrderChange={handleOrderChange}
          {...d}
          selectedIssue={selectedIssue}
        />
      ));

  return (
    <Container>
      <FilterContainer>
        <Filter handleFilterChange={handleSearchChange} filterValue={search} />
        <AssigneesFilter
          updateAssignees={updateAssignees}
          selectedAssignees={selectedAssignees}
          displayNames={displayNames}
        />
      </FilterContainer>
      <Content>
        <Table>
          <ProjectRisksTableHeader
            sort={sort}
            handleSortClick={handleSortClick}
          />
          <tbody>{renderTables()}</tbody>
        </Table>
        {selectedIssue && (
          <IssueDetails
            selectedIssue={selectedIssue}
            handleClose={handleDetailsClose}
          />
        )}
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  max-height: 80vh;
  overflow: auto;
`;

const FilterContainer = styled.div`
  margin: 25px 0;
  display: flex;
`;

const Table = styled.table`
  &,
  table {
    width: 100%;
    height: 100%;
    border-collapse: separate;
  }

  th {
    padding: 10px;

    &:nth-child(1) {
      width: 0.001%;
    }

    &:nth-child(2) {
      width: 0.001%;
    }

    &:nth-child(3) {
      width: 55%;
    }

    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(6),
    &:nth-child(7) {
      width: 8%;
      text-align: center;
    }
  }

  tbody td {
    &[colSpan] {
      padding: 0 !important;
      border: 0 !important;
    }

    padding: 5px 10px;
    cursor: pointer;
    vertical-align: middle;
    position: relative;
    border-bottom: 1px solid #dfdfdf;

    &:first-child {
      border-left: 1px solid #dfdfdf;
    }

    &:last-child {
      border-right: 1px solid #dfdfdf;
    }

    &:nth-child(2) {
      white-space: nowrap;
    }

    &:nth-child(3) {
      max-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

export default memo(ProjectRisksTables);

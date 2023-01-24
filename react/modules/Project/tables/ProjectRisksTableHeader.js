import React, { useCallback } from 'react';
import styled from 'styled-components';

import { columns } from '../metadata';

const ProjectRisksTableHeader = ({
  handleSortClick,
  sort: { sortBy, isDesc },
}) => {
  const getSortIcon = useCallback(
    (accessor) => {
      if (accessor === sortBy) {
        if (isDesc) {
          return '↓';
        }

        return '↑';
      }

      return '';
    },
    [sortBy, isDesc],
  );

  const renderColumns = () =>
    columns.map((column) => (
      <Column
        key={column.accessor}
        className={column.accessor}
        onClick={handleSortClick({ sortBy: column.accessor })}
      >
        {column.header}
        {getSortIcon(column.accessor)}
      </Column>
    ));

  return (
    <Container>
      <tr>{renderColumns()}</tr>
    </Container>
  );
};

const borderColor = '#dfdfdf';

const Container = styled.thead`
  position: sticky;
  top: 0;
  z-index: 2;

  tr {
    background: rgb(255, 255, 255);
    height: 38px;

    > th {
      border-top: 1px solid ${borderColor};
      border-bottom: 1px solid ${borderColor};
      outline: 2px solid #fff;

      &:first-child {
        border-left: 1px solid ${borderColor};
      }

      &:last-child {
        border-right: 1px solid ${borderColor};
      }
    }
  }
`;

const Column = styled.th`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  user-select: none;
`;

export default ProjectRisksTableHeader;

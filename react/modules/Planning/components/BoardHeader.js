import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import Filter from 'src/components/TableFilter';
import { ReactComponent as UndoIcon } from 'src/assets/planning/UndoIcon.svg';
import { getFilter } from '../reducer';
import { updateFilter as updateFilterAction } from '../actions';

const BoardHeader = () => {
  const dispatch = useDispatch();
  const filter = useSelector(getFilter);

  const updateFilter = ({ filter }) =>
    dispatch(
      updateFilterAction({
        filter,
      }),
    );

  const handleFilterChange = (filter) => updateFilter({ filter });

  return (
    <Container>
      <Filter
        InputProps={{ style: { width: 200 } }}
        filterValue={filter}
        handleFilterChange={handleFilterChange}
      />
      {/* <ActionsContainer>
        <Action title="undo">
          <UndoIcon />
        </Action>
        <Action style={{ transform: 'scaleX(-1)' }} title="redo">
          <UndoIcon />
        </Action>
      </ActionsContainer> */}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 10px 235px;
  width: 250px;
`;

// const ActionsContainer = styled.div`
//   margin-left: auto;
//   width: fit-content;
//   display: flex;
//   justify-content: flex-end;
//   height: 20px;
// `;

// const Action = styled.div`
//   border: 1px solid #c4c4c4;
//   margin-right: 10px;
//   border-radius: 3px;
//   cursor: pointer;
//   padding: 0 5px;
// `;

export default memo(BoardHeader);

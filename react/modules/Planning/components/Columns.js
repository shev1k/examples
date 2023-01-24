import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';

import Column from './Column';
import { getBoard } from '../reducer';
import { updateBoard as updateBoardAction } from '../actions';
import { client } from 'src/services/client';

const Content = memo(({ board }) =>
  Object.entries(board)
    .sort(([firstId], [secondId]) => Number(firstId) - Number(secondId))
    .map(([id, sprint]) => <Column key={`sprint-${id}`} {...sprint} />),
);

const Columns = () => {
  const dispatch = useDispatch();
  const board = useSelector(getBoard);

  const updateBoard = ({ board }) => {
    dispatch(updateBoardAction({ board }));
  };

  const sendUpdatedData = async ({ board }) => {
    try {
      const body = {
        sprints: board,
      };

      await client.post('/update_jira_issues', body);
    } catch (err) {
      console.log(err);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = board[source.droppableId];
      const destColumn = board[destination.droppableId];
      const sourceItems = [...sourceColumn.issues];
      const destItems = [...destColumn.issues];
      const [removed] = sourceItems.splice(source.index, 1);

      destItems.splice(destination.index, 0, removed);

      const nextBoard = {
        ...board,
        [source.droppableId]: {
          ...sourceColumn,
          issues: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          issues: destItems,
        },
      };

      updateBoard({
        board: nextBoard,
      });
      sendUpdatedData({
        board: nextBoard,
      });
    } else {
      const column = board[source.droppableId];
      const copiedItems = [...column.issues];
      const [removed] = copiedItems.splice(source.index, 1);

      copiedItems.splice(destination.index, 0, removed);

      const nextBoard = {
        ...board,
        [source.droppableId]: {
          ...column,
          issues: copiedItems,
        },
      };

      updateBoard({
        board: nextBoard,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Content board={board} />
      {/* <ActionContainer>+</ActionContainer> */}
    </DragDropContext>
  );
};

// const ActionContainer = styled.div`
//   border: 1px solid #c4c4c4;
//   padding: 2px;
//   margin-left: 15px;
//   cursor: pointer;
//   border-radius: 3px;
//   color: #858585;
// `;

export default memo(Columns);

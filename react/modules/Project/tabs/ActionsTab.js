import React from 'react';

import Graph from '../components/Graph';

const ActionsTab = ({
  actions,
  completed_strikes,
  incomplete_strikes,
  risks,
  isDone,
}) => {
  return (
    <Graph
      actions={actions}
      completed_strikes={completed_strikes}
      incomplete_strikes={incomplete_strikes}
      risks={risks}
      isDone={isDone}
    />
  );
};

export default ActionsTab;

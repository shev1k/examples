import Popover from '@material-ui/core/Popover';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import React, { memo, useState, useRef } from 'react';
import styled from 'styled-components';

import AssigneeCircle from 'src/components/AssigneeCircle';
import { getNameInitials } from 'src/utils/utils';

const AssigneesFilter = ({
  displayNames,
  updateAssignees,
  selectedAssignees,
}) => {
  const [open, setOpen] = useState(false);
  const anchorEl = useRef(null);
  const assignees = [...displayNames, null];

  const removeAssignee = (assignee) => {
    updateAssignees(
      selectedAssignees.filter(
        (selectedAssignee) => selectedAssignee !== assignee,
      ),
    );
  };

  const addAssignee = (assignee) => {
    updateAssignees([...selectedAssignees, assignee]);
  };

  const handleClick = (assignee) => () => {
    if (selectedAssignees.includes(assignee)) {
      removeAssignee(assignee);
    } else {
      addAssignee(assignee);
    }
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const firstHalfAssignees = assignees.slice(0, 5);
  const secondHalfAssignees = assignees.slice(5);

  const renderAssigneeCircles = () =>
    firstHalfAssignees.map((assignee) => {
      const initials = getNameInitials(assignee || '') || 'n.a';
      const isActive = selectedAssignees.includes(assignee);
      const styles = {
        background: '#C1C7D0',
      };

      if (isActive) {
        styles.border = '1px solid white';
        styles.outline = '2px solid #C1C7D0';
      }

      return (
        <AssigneeCircle
          key={assignee}
          title={assignee}
          onClick={handleClick(assignee)}
          styles={styles}
        >
          {initials}
        </AssigneeCircle>
      );
    });

  const renderAdditionalAssignees = () => {
    return secondHalfAssignees.map((assignee) => {
      const checked = selectedAssignees.includes(assignee);

      return (
        <AssigneeRow key={assignee} onClick={handleClick(assignee)}>
          <Checkbox>
            {checked && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
              >
                <path
                  fill="grey"
                  d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
                />
              </svg>
            )}
          </Checkbox>
          <span>{assignee || 'Unassigned'}</span>
        </AssigneeRow>
      );
    });
  };

  return (
    <Container>
      {renderAssigneeCircles()}
      {secondHalfAssignees.length !== 0 && (
        <div ref={anchorEl}>
          <AssigneeCircle onClick={handleToggle} styles={{ transform: 'none' }}>
            +{secondHalfAssignees.length}
          </AssigneeCircle>
        </div>
      )}
      <Popover
        anchorEl={anchorEl.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={open}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <AssigneesContainer>{renderAdditionalAssignees()}</AssigneesContainer>
        </ClickAwayListener>
      </Popover>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;

  > div {
    cursor: pointer;
    margin-right: 7px;
    transition: transform 0.1s;

    :not(:last-child):hover {
      transform: translateY(-2px);
    }
  }
`;

const AssigneesContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding: 5px 7px;
  border: 1px solid #dfdfdf;
  border-radius: 3px;
  background: #fff;
`;

const AssigneeRow = styled.div`
  font-family: Montserrat;
  font-size: 11px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 5px;
`;

const Checkbox = styled.div`
  position: relative;
  width: 15px;
  height: 15px;
  border: 1px solid grey;
  border-radius: 3px;
  margin-right: 5px;

  > svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -40%);
  }
`;

export default memo(AssigneesFilter);

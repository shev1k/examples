import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import styled from 'styled-components';

import { ReactComponent as FoldIcon } from 'src/assets/icons/FoldIcon.svg';

const StatusSelector = ({
  fold,
  groupName,
  groupNamesWithCategory,
  toggleFold,
  handleOrderChange,
}) => {
  return (
    <SelectContainer>
      <FoldIconContainer fold={fold} onClick={toggleFold}>
        <FoldIcon />
      </FoldIconContainer>
      <Select
        IconComponent={() => (
          <span
            style={{
              top: 'calc(50% - 8px)',
              color: 'rgba(0, 0, 0, 0.54)',
              right: 10,
              position: 'absolute',
              pointerEvents: 'none',
              fontSize: 14,
            }}
          >
            <svg
              strokeWidth={2}
              fill="white"
              width="10"
              height="10"
              viewBox="0 0 10 10"
            >
              <path
                d="
                    M 0,0
                    L 5,5
                    L 10,0
                  "
                stroke="grey"
              />
            </svg>
          </span>
        )}
        onChange={handleOrderChange(groupName)}
        value={groupName}
      >
        {Object.entries(groupNamesWithCategory).map(
          ([groupName, statusColor]) => (
            <MenuItem key={groupName} value={groupName}>
              <GroupItemText groupName={groupName} statusColor={statusColor}>
                {groupName}
              </GroupItemText>
            </MenuItem>
          ),
        )}
      </Select>
    </SelectContainer>
  );
};

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px !important;
  margin-bottom: 5px !important;

  .MuiInput-underline:before {
    border-bottom: none !important;
  }
`;

const FoldIconContainer = styled.div`
  margin-right: 5px;
  cursor: pointer;

  ${({ fold }) => {
    if (fold) {
      return 'transform: rotate(-90deg);';
    }
  }}
`;

const GroupItemText = styled.span`
  background: ${({ statusColor }) => statusColor || '#6D788A'} !important;
  text-transform: uppercase;
  color: white;
  font-family: Montserrat;
  font-weight: bold;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 5px;
`;

export default StatusSelector;

import * as React from 'react';

interface IProps {
  onMouseDown: (e: React.SyntheticEvent) => void;
  role: string;
  xPos: number;
  yPos: number;
}

const DragHandle = ({ yPos, xPos, onMouseDown, role }: IProps) => {
  return (
    <g
      cursor="pointer"
      data-role={role}
      onMouseDown={onMouseDown}
      transform={`translate(${xPos}, ${yPos})`}
    >
      <rect
        data-role={role}
        fill="transparent"
        height="20"
        width="20"
        x="0"
        y="0"
      />
      <line
        data-role={role}
        stroke="black"
        strokeWidth="1"
        x1="5"
        x2="5"
        y1="5"
        y2="15"
      />
      <line
        data-role={role}
        x1="10"
        x2="10"
        y1="5"
        y2="15"
        stroke="black"
        strokeWidth="1"
      />
      <line
        data-role={role}
        x1="15"
        x2="15"
        y1="5"
        y2="15"
        stroke="black"
        strokeWidth="1"
      />
    </g>
  );
};

export default DragHandle;

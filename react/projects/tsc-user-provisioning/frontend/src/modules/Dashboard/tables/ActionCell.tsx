import { blue } from '@mui/material/colors';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { PropsWithChildren } from 'react';

const style = {
  color: blue[800],
  cursor: 'pointer',
};

interface IActionCellProps extends PropsWithChildren<GridRenderCellParams> {
  onClick: (uuid: string) => void;
}

const ActionCell: React.FC<IActionCellProps> = ({ children, row, onClick }) => (
  <span style={style} onClick={() => onClick(row.uuid)}>
    {children}
  </span>
);

export default ActionCell;

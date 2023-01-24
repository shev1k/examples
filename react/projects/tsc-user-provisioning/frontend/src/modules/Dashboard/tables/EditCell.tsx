import { blue } from '@mui/material/colors';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const style = {
  color: blue[800],
  cursor: 'pointer',
  textDecoration: 'none',
};

interface IEditCellProps extends GridRenderCellParams {
  href: (uuid: string) => string;
}

const EditCell: React.FC<IEditCellProps> = ({ row, href }) => {
  const navigate = useNavigate();
  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate(href(row.uuid));
  };

  return (
    <a
      style={style}
      href={document.location.origin + href(row.uuid)}
      onClick={onClick}
    >
      Edit
    </a>
  );
};

export default EditCell;

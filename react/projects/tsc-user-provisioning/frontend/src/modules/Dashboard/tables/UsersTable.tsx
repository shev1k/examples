import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMemo, memo } from 'react';

import { DataGrid, EmailCell } from 'components';
import { LEARNER_ROLE_DISPLAY_MAP } from 'maps';
import {
  ITableProps,
  IPagination,
  IPaginationActions,
  ISortModel,
} from '../interfaces';

interface IUsersTableProps extends ITableProps, IPagination, IPaginationActions {
  rowCount?: number;
  sortModel: ISortModel;
  onSortModelChange: (nextSortModel: ISortModel) => void;
}

const UsersTable: React.FC<IUsersTableProps> = ({
  actions,
  data,
  loading,
  page,
  pageSize,
  sortModel,
  rowCount,
  onPageChange,
  onPageSizeChange,
  onSortModelChange,
}) => {
  const columns: GridColDef[] = useMemo(
    () => [
      ...actions,
      {
        field: 'cafe_number',
        headerName: 'Café Number',
        sortable: false,
        maxWidth: 200,
        flex: 1,
      },
      {
        field: 'email',
        headerName: 'Email',
        sortable: true,
        flex: 1,
        renderCell: ({ row }) => <EmailCell email={row.email} />,
      },
      {
        field: 'firstname',
        headerName: 'First Name',
        sortable: true,
        flex: 1,
        maxWidth: 140,
      },
      {
        field: 'lastname',
        headerName: 'Last Name',
        sortable: true,
        flex: 1,
        maxWidth: 140,
      },
      {
        field: 'role',
        headerName: 'Learner Role',
        sortable: true,
        flex: 1,
        valueFormatter: ({ value }) => LEARNER_ROLE_DISPLAY_MAP[value],
      },
    ],
    [actions],
  );

  return (
    <Box height="100%">
      <DataGrid
        autoHeight
        rows={data}
        columns={columns}
        loading={loading}
        page={page}
        pagination
        paginationMode="server"
        pageSize={pageSize}
        rowCount={rowCount}
        sortModel={[{ field: sortModel.field, sort: sortModel.order }]}
        getRowId={(row) => row.uuid}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onSortModelChange={([nextModel]) =>
          onSortModelChange(
            nextModel
              ? { field: nextModel.field, order: nextModel.sort }
              : undefined,
          )
        }
      />
    </Box>
  );
};

export default memo(UsersTable);

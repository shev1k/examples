import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';

import { DataGrid } from 'components';
import { ITableProps, ISortModel, ISortModelActions } from '../interfaces';

const SupportsTable: React.FC<
  ITableProps & ISortModelActions & { sortModel: ISortModel }
> = ({ actions = [], data, sortModel, loading, onSortModelChange }) => {
  const columns: GridColDef[] = useMemo(
    () => [
      ...actions,
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
        field: 'department',
        headerName: 'Department',
        sortable: true,
        flex: 1,
      },
    ],
    [actions],
  );

  return (
    <Box height="90%">
      <DataGrid
        hideFooter
        rows={data}
        columns={columns}
        loading={loading}
        sortModel={[{ field: sortModel.field, sort: sortModel.order }]}
        onSortModelChange={([nextModel]) =>
          onSortModelChange(
            nextModel
              ? { field: nextModel.field, order: nextModel.sort }
              : undefined,
          )
        }
        getRowId={(row) => row.uuid}
      />
    </Box>
  );
};

export default SupportsTable;

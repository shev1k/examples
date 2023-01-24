import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';

import { AccountStatus } from 'enums';
import UsersHeader from '../components/UsersHeader';
import UsersFilter from '../components/UsersFilter';
import UsersTable from '../tables/UsersTable';
import { useUsers, useFilter, usePagination, useSortModel } from '../hooks';
import { IUsersFilter } from '../interfaces';
import ActionCell from '../tables/ActionCell';
import EditCell from '../tables/EditCell';

interface IUsersPageProps {
  accountStatus: AccountStatus;
}

const UsersPage: React.FC<IUsersPageProps> = ({ accountStatus: account_status }) => {
  const { filter, onFilterChange } = useFilter<Partial<IUsersFilter>>();
  const { page, pageSize, onPageChange, onPageSizeChange } = usePagination();
  const { sortModel, onSortModelChange } = useSortModel();

  const { data, loading, rowCount, activate, deactivate } = useUsers({
    account_status,
    filter,
    page,
    pageSize,
    sortModel,
  });

  const actions = useMemo(
    (): GridColDef[] => [
      {
        field: `_edit`,
        headerName: 'Edit',
        sortable: false,
        renderCell: (cellProps) => (
          <EditCell href={(uuid) => `/user/update/${uuid}`} {...cellProps} />
        ),
      },
      {
        field: `_support-action`,
        headerName:
          account_status === AccountStatus.active ? 'Deactivate' : 'Reactivate',
        sortable: false,
        renderCell: (cellProps) => (
          <ActionCell
            onClick={(uuid) =>
              account_status === AccountStatus.active
                ? deactivate(uuid)
                : activate(uuid)
            }
            {...cellProps}
          >
            {account_status === AccountStatus.active ? 'Deactivate' : 'Reactivate'}
          </ActionCell>
        ),
      },
    ],
    [account_status, activate, deactivate],
  );

  return (
    <Box height="100%" maxWidth="100%">
      <UsersHeader />
      <UsersFilter onChange={onFilterChange} />
      <UsersTable
        actions={actions}
        data={data}
        loading={loading}
        page={page}
        pageSize={pageSize}
        rowCount={rowCount}
        sortModel={sortModel}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onSortModelChange={onSortModelChange}
      />
    </Box>
  );
};

export default UsersPage;

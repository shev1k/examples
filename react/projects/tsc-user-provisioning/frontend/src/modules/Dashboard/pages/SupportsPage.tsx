import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';

import { AccountStatus } from 'enums';
import SupportsHeader from '../components/SupportsHeader';
import SupportsFilter from '../components/SupportsFilter';
import SupportsTable from '../tables/SupportsTable';
import { useSupports, useFilter, useSortModel } from '../hooks';
import { ISupportsFilter } from '../interfaces';

import ActionCell from '../tables/ActionCell';
import EditCell from '../tables/EditCell';

interface ISupportsPageProps {
  accountStatus: AccountStatus;
}

const SupportsPage: React.FC<ISupportsPageProps> = ({
  accountStatus: account_status,
}) => {
  const { filter, onFilterChange } = useFilter<Partial<ISupportsFilter>>();
  const { sortModel, onSortModelChange } = useSortModel();
  const { data, loading, activate, deactivate } = useSupports({
    account_status,
    filter,
    sortModel,
  });

  const actions = useMemo(
    (): GridColDef[] => [
      {
        field: `_edit`,
        headerName: 'Edit',
        sortable: false,
        renderCell: (cellProps) => (
          <EditCell href={(uuid) => `/support/update/${uuid}`} {...cellProps} />
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
      <SupportsHeader />
      <SupportsFilter onChange={onFilterChange} />
      <SupportsTable
        actions={actions}
        data={data}
        sortModel={sortModel}
        loading={loading}
        onSortModelChange={onSortModelChange}
      />
    </Box>
  );
};

export default SupportsPage;

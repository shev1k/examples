import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { AccountStatus } from 'enums';
import { dashboardService } from 'services';
import { useRowCount } from '../hooks';
import { IPagination, ISortModel, IUsersFilter } from '../interfaces';
import { DASHBOARD_USERS_QUERY_KEY, useGetUsers } from '../queries';

interface IUseUsers extends IPagination {
  account_status: AccountStatus;
  filter: Partial<IUsersFilter>;
  sortModel: ISortModel;
}

const useUsers = ({
  account_status,
  filter,
  sortModel,
  page,
  pageSize,
}: IUseUsers) => {
  const queryClient = useQueryClient();
  const { data, totalItems, loading } = useGetUsers({
    account_status,
    filter,
    page,
    pageSize,
    sortModel,
  });
  const { rowCount } = useRowCount({ totalItems });

  const onSuccess = () =>
    queryClient.invalidateQueries({ queryKey: [DASHBOARD_USERS_QUERY_KEY] });

  const deactivateMutation = useMutation(dashboardService.deactivateUser, {
    onSuccess,
  });

  const activateMutation = useMutation(dashboardService.activateUser, {
    onSuccess,
  });

  const activate = useCallback(
    (uuid: string) => activateMutation.mutate(uuid),
    [activateMutation],
  );

  const deactivate = useCallback(
    (uuid: string) => deactivateMutation.mutate(uuid),
    [deactivateMutation],
  );

  return {
    data,
    rowCount,
    loading,
    deactivate,
    activate,
  };
};

export default useUsers;

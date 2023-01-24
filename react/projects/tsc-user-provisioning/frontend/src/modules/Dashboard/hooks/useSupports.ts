import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

import { dashboardService } from 'services';
import { AccountStatus } from 'enums';
import { useGetSupports, DASHBOARD_SUPPORTS_QUERY_KEY } from '../queries';
import { ISupportsFilter, ISortModel } from '../interfaces';

interface IUseUsers {
  account_status: AccountStatus;
  filter: Partial<ISupportsFilter>;
  sortModel: ISortModel;
}

const useUsers = ({ account_status, filter, sortModel }: IUseUsers) => {
  const queryClient = useQueryClient();
  const { data, loading } = useGetSupports({
    filter,
    account_status,
    sortModel,
  });

  const onSuccess = () =>
    queryClient.invalidateQueries({ queryKey: [DASHBOARD_SUPPORTS_QUERY_KEY] });

  const deactivateMutation = useMutation(dashboardService.deactivateSupport, {
    onSuccess,
  });

  const activateMutation = useMutation(dashboardService.activateSupport, {
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

  useEffect(() => {}, []);

  return {
    data,
    loading,
    deactivate,
    activate,
  };
};

export default useUsers;

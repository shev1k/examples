import { useQuery } from '@tanstack/react-query';
import * as R from 'ramda';

import { AccountStatus } from 'enums';
import { dashboardService } from 'services';
import { STALE_TIME } from '../constants';
import { ISupportsFilter, ISortModel } from '../interfaces';

interface IUseGetSupports {
  filter: Partial<ISupportsFilter>;
  account_status: AccountStatus;
  sortModel: ISortModel;
}

interface IQueryKeys extends IUseGetSupports {}

// every argument should be debounced or memoized
export const useGetSupports = ({
  filter,
  account_status,
  sortModel,
}: IUseGetSupports) => {
  const {
    data: { data },
    isError: error,
    isLoading: loading,
  } = useQuery(
    queryKeys.all({ filter, account_status, sortModel }),
    () =>
      dashboardService.fetchSupports(
        R.mergeLeft(filter, { account_status, sortModel }),
      ),
    {
      keepPreviousData: true,
      staleTime: STALE_TIME,
      cacheTime: STALE_TIME,
      placeholderData: { data: [] },
    },
  );

  return { data, loading, error };
};

export const DASHBOARD_SUPPORTS_QUERY_KEY = 'dashboard-supports';

const queryKeys = {
  all: ({ filter, account_status, sortModel }: IQueryKeys) => [
    DASHBOARD_SUPPORTS_QUERY_KEY,
    filter,
    account_status,
    sortModel,
  ],
};

import { useQuery } from '@tanstack/react-query';
import * as R from 'ramda';

import { AccountStatus } from 'enums';
import { dashboardService } from 'services';
import { STALE_TIME } from '../constants';
import { IUsersFilter, IPagination, ISortModel } from '../interfaces';

interface IUseGetUsers extends IPagination {
  filter: Partial<IUsersFilter>;
  account_status: AccountStatus;
  sortModel: ISortModel;
}

interface IQueryKeys extends IUseGetUsers {}

// every argument should be debounced or memoized
export const useGetUsers = ({
  account_status,
  filter,
  page,
  pageSize,
  sortModel,
}: IUseGetUsers) => {
  const {
    data: { data, totalItems },
    isError: error,
    isLoading,
    isFetching,
  } = useQuery(
    queryKeys.all({
      account_status,
      filter,
      page,
      pageSize,
      sortModel,
    }),
    () =>
      dashboardService.fetchUsers(
        R.mergeLeft(filter, {
          account_status,
          page,
          pageSize,
          sortModel,
        }),
      ),
    {
      keepPreviousData: true,
      staleTime: STALE_TIME,
      placeholderData: { data: [], totalItems: 0, currentPage: 0, totalPages: 0 },
    },
  );

  return { data, totalItems, loading: isLoading || isFetching, error };
};

export const DASHBOARD_USERS_QUERY_KEY = 'dashboard-users';

const queryKeys = {
  all: ({ filter, account_status, page, pageSize, sortModel }: IQueryKeys) => [
    DASHBOARD_USERS_QUERY_KEY,
    filter,
    account_status,
    page,
    pageSize,
    sortModel,
  ],
};

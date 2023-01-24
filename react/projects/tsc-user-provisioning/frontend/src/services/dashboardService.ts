import client from 'configs/client';
import { AccountStatus, UserRole, SupportRole } from 'enums';
import { IResponseBodyWithPagination } from 'interfaces';
import { omitEmpty } from 'utils';
import {
  IUsersFilter,
  ISupportsFilter,
  IUser,
  IPagination,
  ISortModel,
} from 'modules/Dashboard/interfaces';

interface IGetQueryParams {
  account_status: AccountStatus;
}

interface IGetUsersQueryParams extends IGetQueryParams, IUsersFilter, IPagination {
  role?: UserRole;
  sortModel: ISortModel;
}

interface IGetSupportsQueryParams extends IGetQueryParams, ISupportsFilter {
  role?: SupportRole;
  sortModel: ISortModel;
}

class DashboardService {
  public fetchUsers = async ({
    sortModel: { field, order },
    ...rest
  }: IGetUsersQueryParams) => {
    const params = { ...rest, field, order };
    const query = this.convertToQueryParams(params);
    return await client.get<IResponseBodyWithPagination<IUser[]>>(
      `/dashboard/users?${query}`,
    );
  };

  public fetchSupports = async ({
    sortModel: { field, order },
    ...rest
  }: IGetSupportsQueryParams) => {
    const params = { ...rest, field, order };
    const query = this.convertToQueryParams(params);
    return await client.get(`/dashboard/supports?${query}`);
  };

  public activateUser = async (uuid: string) => {
    return await client.put('/dashboard/users/activate', { uuid });
  };

  public deactivateUser = async (uuid: string) => {
    return await client.put('/dashboard/users/deactivate', { uuid });
  };

  public activateSupport = async (uuid: string) => {
    return await client.put('/dashboard/supports/activate', { uuid });
  };

  public deactivateSupport = async (uuid: string) => {
    return await client.put('/dashboard/supports/deactivate', { uuid });
  };

  private convertToQueryParams = (params: Record<string, any>) => {
    return Object.entries(omitEmpty(params))
      .map((kv) => {
        if (Array.isArray(kv[1])) kv[0] += '[]';
        return kv.map(encodeURIComponent).join('=');
      })
      .join('&');
  };
}

const dashboardService = new DashboardService();

export default dashboardService;

import { Request } from 'express';

import { AccountStatus, UserRole, SupportRole } from '@/enums';
import { IPaginationQueryParams } from '@/interfaces/pagination';

interface ISortParams {
  field?: string;
  order?: string;
}

interface IGetUsersQueryParams extends IPaginationQueryParams, ISortParams {
  account_status: AccountStatus;
  role?: UserRole;
  firstname?: string;
  lastname?: string;
  email?: string;
  cafe_number?: string[];
}

interface IGetSupportsQueryParams extends ISortParams {
  account_status: AccountStatus;
  role?: SupportRole;
  firstname?: string;
  lastname?: string;
  email?: string;
}

interface IPutUpdateUserStatusBody {
  uuid: string;
}

export interface IGetSupportsRequest
  extends Request<{}, {}, {}, IGetSupportsQueryParams> {}

export interface IGetUsersRequest extends Request<{}, {}, {}, IGetUsersQueryParams> {}

export interface IUpdateUserStatusRequest
  extends Request<{}, {}, IPutUpdateUserStatusBody> {}

import { GridColDef } from '@mui/x-data-grid';

import { UserRole, SupportRole } from 'enums';

export interface IUser {
  uuid: string;
  cafe_number: string;
  email: string;
  firstname: string;
  lastname: string;
  role: UserRole;
}

export interface ISupport {
  uuid: string;
  firstname: string;
  lastname: string;
  department: string;
}

export interface ISearchFilter {
  firstname?: string;
  lastname?: string;
  email?: string;
}

export interface IUsersFilter extends ISearchFilter {
  role?: UserRole;
  cafe_number?: string[];
}

export interface ISupportsFilter extends ISearchFilter {
  role?: SupportRole;
}

export interface ITableProps {
  actions: GridColDef[];
  data: Array<IUser | ISupport>;
  loading: boolean;
}

export interface IPagination {
  page: number;
  pageSize: number;
}

export interface IPaginationActions {
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface IUseRowCount {
  totalItems?: number;
}

type SortOrder = 'asc' | 'desc' | null | undefined;

export interface ISortModel {
  field: string;
  order: SortOrder;
}

export interface ISortModelActions {
  onSortModelChange: (sortModel: ISortModel) => void;
}

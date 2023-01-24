import {
  AccountCircle,
  AssistWalker,
  SupportAgent,
  PersonOff,
  SvgIconComponent,
} from '@mui/icons-material';

import { AccountType, AccountStatus } from 'enums';
import UsersPage from 'modules/Dashboard/pages/UsersPage';
import SupportsPage from 'modules/Dashboard/pages/SupportsPage';
import UserFormPage from 'modules/Forms/pages/UserFormPage';

interface IRoute {
  path: string;
  roles: AccountType[];
  label?: string;
  componentProps?: Record<string, any>;
  hidden?: boolean;
  Component: React.FC<any>;
  Icon?: SvgIconComponent;
}

export const routes: IRoute[] = [
  {
    path: '/',
    label: 'Active Users',
    roles: [AccountType.admin, AccountType.user, AccountType.support],
    componentProps: { accountStatus: AccountStatus.active, key: 0 },
    Component: UsersPage,
    Icon: AccountCircle,
  },
  {
    path: '/deactivated-users',
    label: 'Deactivated Users',
    roles: [AccountType.admin, AccountType.user, AccountType.support],
    componentProps: { accountStatus: AccountStatus.deactivated, key: 1 },
    Component: UsersPage,
    Icon: PersonOff,
  },
  {
    path: '/active-supports',
    label: 'Active Supports',
    roles: [AccountType.admin],
    componentProps: { accountStatus: AccountStatus.active },
    Component: SupportsPage,
    Icon: SupportAgent,
  },
  {
    path: '/deactivated-supports',
    label: 'Deactivated Supports',
    roles: [AccountType.admin],
    componentProps: { accountStatus: AccountStatus.deactivated },
    Component: SupportsPage,
    Icon: AssistWalker,
  },
  {
    path: '/user/create',
    roles: [AccountType.admin, AccountType.user],
    Component: UserFormPage,
    hidden: true,
  },
  {
    path: '/user/update/:userId',
    roles: [AccountType.admin, AccountType.user],
    Component: UserFormPage,
    hidden: true,
  },
];

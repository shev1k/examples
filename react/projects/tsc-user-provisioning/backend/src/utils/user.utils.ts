import { AccountType, AdminRole, SupportRole, UserRole } from '@/enums';
import { IUserDto } from '@/dtos/user.dto';

export const getAccountType = (role: IUserDto['role']): AccountType => {
  if (role in AdminRole) {
    return AccountType.admin;
  }

  if (role in SupportRole) {
    return AccountType.support;
  }

  if (role in UserRole) {
    return AccountType.user;
  }
};

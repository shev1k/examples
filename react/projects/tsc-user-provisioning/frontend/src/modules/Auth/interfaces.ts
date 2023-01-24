import { AdminRole, AccountType, SupportRole, UserRole } from 'enums';

export interface ICurrentUser {
  email: string;
  firstname: string;
  lastname: string;
  role: AdminRole | SupportRole | UserRole;
  langcode: string;
  employment_status: string;
  accountType: AccountType;
  cafeNumbers: string[];
  decentralizedCafes: string[];
}

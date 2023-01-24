import { UserRole, EmploymentStatus } from 'enums';

import { IUserFormFields } from './interfaces';

export const userDefaultValues: IUserFormFields = {
  firstname: '',
  lastname: '',
  email: '',
  role: '' as UserRole,
  employment_status: '' as EmploymentStatus,
  decentralized_cafes: '',
  is_head_of_decentralized_cafes: false,
  cafe_number: [],
};

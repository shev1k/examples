import { UserRole, EmploymentStatus } from 'enums';

export interface IUserFormFields {
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  employment_status: EmploymentStatus;
  decentralized_cafes?: string;
  is_head_of_decentralized_cafes?: boolean;
  cafe_number: string[];
}

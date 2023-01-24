import { UserRole, EmploymentStatus } from 'enums';

export const ROLE_EMPLOYMENT_STATUS_MAP = {
  [UserRole.district_manager]: EmploymentStatus.Salaried,
  [UserRole.above_cafe_leader]: EmploymentStatus.Salaried,
  [UserRole.franchisee]: EmploymentStatus.Salaried,
  [UserRole.crew_member]: EmploymentStatus.Hourly,
  [UserRole.shift_leader]: EmploymentStatus.Hourly,
  [UserRole.assistant_manager]: EmploymentStatus.Hourly,
  [UserRole.general_manager]: EmploymentStatus.Hourly,
};

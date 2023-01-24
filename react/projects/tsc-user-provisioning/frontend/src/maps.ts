import { UserRole, EmploymentStatus } from 'enums';

export const LEARNER_ROLE_DISPLAY_MAP = {
  [UserRole.crew_member]: 'Crew Member',
  [UserRole.shift_leader]: 'Shift Leader',
  [UserRole.assistant_manager]: 'Assistant Manager',
  [UserRole.general_manager]: 'General Manager',
  [UserRole.district_manager]: 'District Manager',
  [UserRole.above_cafe_leader]: 'Above Cafe Leader',
  [UserRole.franchisee]: 'Franchisee',
};

export const EMPLOYMENT_STATUS_DISPLAY_MAP = {
  [EmploymentStatus.Hourly]: 'Hourly',
  [EmploymentStatus.Salaried]: 'Salaried',
};

export enum AboveUnitUserRole {
  district_manager = 'district_manager',
  above_cafe_leader = 'above_cafe_leader',
  franchisee = 'franchisee',
}

export enum RegularUnitUserRole {
  crew_member = 'crew_member',
  shift_leader = 'shift_leader',
  assistant_manager = 'assistant_manager',
  general_manager = 'general_manager',
}

// unioun of AboveUnitUserRole and RegularUnitUserRole
export enum UserRole {
  district_manager = 'district_manager',
  above_cafe_leader = 'above_cafe_leader',
  franchisee = 'franchisee',
  crew_member = 'crew_member',
  shift_leader = 'shift_leader',
  assistant_manager = 'assistant_manager',
  general_manager = 'general_manager',
};

export enum SupportRole {
  contractor = 'contractor',
  coordinator = 'coordinator',
  specialist = 'specialist',
  manager = 'manager',
  senior_manager = 'senior_manager',
  director = 'director',
  senior_director = 'senior_director',
  vice_president = 'vice_president',
  senior_vice_president = 'senior_vice_president',
  executive = 'executive',
}

export enum AdminRole {
  administrator = 'administrator',
}

export enum AccountType {
  admin = 'admin',
  user = 'user',
  support = 'support',
}

export enum AccountStatus {
  'active' = 'active',
  'deactivated' = 'deactivated',
}

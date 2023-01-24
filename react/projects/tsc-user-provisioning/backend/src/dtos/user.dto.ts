import { ModelDefined, Optional } from 'sequelize';

import { AdminRole, SupportRole, UserRole } from '@/enums';

export interface IUserDto {
  uuid: string;
  created: Date | null;
  completed: Date | null;
  changed: Date | null;
  in_draft: number;
  langcode: string;
  firstname: string;
  lastname: string;
  email: string;
  email_original: string | null;
  email_validation_outcome: string | null;
  role: AdminRole | SupportRole | UserRole | null;
  employment_status: string | null;
  roles: string | null;
  decentralized_cafes: string | null;
  is_head_of_decentralized_cafes: number | null;
  cafe_number: string;
  password: string;
  schoox_id: number | null;
  schoox_above_id: number | null;
  is_deactivated: number;
}

export interface IUserCreationDto
  extends Optional<
    IUserDto,
    | 'uuid'
    | 'schoox_id'
    | 'email_original'
    | 'email_validation_outcome'
    | 'role'
    | 'roles'
    | 'decentralized_cafes'
    | 'is_head_of_decentralized_cafes'
    | 'cafe_number'
    | 'schoox_above_id'
    | 'created'
    | 'completed'
    | 'changed'
    | 'in_draft'
    | 'is_deactivated'
    | 'employment_status'
  > {}

export interface IUserModel extends ModelDefined<IUserDto, IUserCreationDto> {}

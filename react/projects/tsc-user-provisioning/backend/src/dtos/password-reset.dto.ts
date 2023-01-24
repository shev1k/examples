import { ModelDefined } from 'sequelize';

export interface IPasswordResetDto {
  user_id: string;
  token: string;
  expiration: Date;
}

export interface IPasswordResetCreationDto extends IPasswordResetDto {}

export interface IPasswordResetTokenModel
  extends ModelDefined<IPasswordResetDto, IPasswordResetCreationDto> {}

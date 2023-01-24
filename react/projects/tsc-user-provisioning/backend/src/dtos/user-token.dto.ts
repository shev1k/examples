import { ModelDefined } from 'sequelize';

export interface IUserTokenDto {
  token: string;
  expiration: Date;
}

export interface IUserTokenCreationDto extends IUserTokenDto {}

export interface IUserTokenModel
  extends ModelDefined<IUserTokenDto, IUserTokenCreationDto> {}

import { Sequelize, DataTypes } from 'sequelize';

import { IUserTokenModel } from '@/dtos/user-token.dto';

const userTokenModel = (sequelize: Sequelize): IUserTokenModel =>
  sequelize.define('user_token', {
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    expiration: {
      type: DataTypes.DATE,
    },
  });

export default userTokenModel;

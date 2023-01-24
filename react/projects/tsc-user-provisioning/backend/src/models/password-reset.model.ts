import { Sequelize, DataTypes } from 'sequelize';

import { IPasswordResetTokenModel } from '@/dtos/password-reset.dto';

const passwordResetTokenModel = (sequelize: Sequelize): IPasswordResetTokenModel =>
  sequelize.define('password_reset_tokens', {
    user_id: {
      type: DataTypes.CHAR(255),
    },
    token: {
      type: DataTypes.CHAR(65),
      primaryKey: true,
    },
    expiration: {
      type: DataTypes.DATE(6),
    },
  });

export default passwordResetTokenModel;

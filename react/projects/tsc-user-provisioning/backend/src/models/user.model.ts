import { DataTypes, Sequelize } from 'sequelize';

import { IUserModel } from '@/dtos/user.dto';

const userModel = (sequelize: Sequelize): IUserModel =>
  sequelize.define('user', {
    uuid: {
      type: DataTypes.CHAR(255),
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    schoox_id: {
      type: DataTypes.BIGINT,
      defaultValue: null,
    },
    firstname: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
    lastname: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
    password: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
    email_original: {
      type: DataTypes.CHAR(255),
      defaultValue: null,
    },
    email_validation_outcome: {
      type: DataTypes.CHAR(45),
      defaultValue: null,
    },
    langcode: {
      type: DataTypes.CHAR(45),
      allowNull: false,
    },
    role: {
      type: DataTypes.CHAR(45),
      defaultValue: null,
    },
    roles: {
      type: DataTypes.CHAR(255),
      defaultValue: null,
    },
    decentralized_cafes: {
      type: DataTypes.CHAR(255),
      defaultValue: null,
    },
    is_head_of_decentralized_cafes: {
      type: DataTypes.TINYINT,
      defaultValue: null,
    },
    cafe_number: {
      type: DataTypes.TEXT('medium'),
      defaultValue: null,
    },
    schoox_above_id: {
      type: DataTypes.CHAR(255),
      defaultValue: null,
    },
    created: {
      type: DataTypes.DATE(6),
      defaultValue: null,
    },
    completed: {
      type: DataTypes.DATE(6),
      defaultValue: null,
    },
    changed: {
      type: DataTypes.DATE(6),
      defaultValue: null,
    },
    in_draft: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    is_deactivated: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    employment_status: {
      type: DataTypes.CHAR(45),
      defaultValue: null,
    },
  });

export default userModel;

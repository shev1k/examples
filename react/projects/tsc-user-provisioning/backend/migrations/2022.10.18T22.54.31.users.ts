import { DataTypes, QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

import { ColumnUtils } from './utils';

export const up: MigrationFn<QueryInterface> = async ({
  context: queryInterface,
}) => {
  const columnUtils = new ColumnUtils(queryInterface, 'users');

  try {
    await columnUtils.renameColumn('id', 'uuid');
  } catch (_err) {}

  await columnUtils.changeColumn('uuid', {
    type: DataTypes.CHAR(255),
    autoIncrement: false,
    defaultValue: DataTypes.UUIDV4,
  });

  await columnUtils.addColumn('schoox_id', {
    type: DataTypes.BIGINT,
    defaultValue: null,
  });

  await columnUtils.renameColumn('firstName', 'firstname');
  await columnUtils.changeColumn('firstname', {
    type: DataTypes.CHAR(255),
    allowNull: false,
  });

  await columnUtils.renameColumn('lastName', 'lastname');
  await columnUtils.changeColumn('lastname', {
    type: DataTypes.CHAR(255),
    allowNull: false,
  });

  await columnUtils.changeColumn('email', {
    type: DataTypes.CHAR(255),
    allowNull: false,
  });

  await columnUtils.changeColumn('password', {
    type: DataTypes.CHAR(255),
    allowNull: false,
  });

  await columnUtils.addColumn('email_original', {
    type: DataTypes.CHAR(255),
    defaultValue: null,
  });

  await columnUtils.addColumn('email_validation_outcome', {
    type: DataTypes.CHAR(45),
    defaultValue: null,
  });

  await columnUtils.addColumn('langcode', {
    type: DataTypes.CHAR(45),
    allowNull: false,
  });

  await columnUtils.addColumn('role', {
    type: DataTypes.CHAR(45),
    defaultValue: null,
  });

  await columnUtils.addColumn('roles', {
    type: DataTypes.CHAR(255),
    defaultValue: null,
  });

  await columnUtils.addColumn('decentralized_cafes', {
    type: DataTypes.CHAR(255),
    defaultValue: null,
  });

  await columnUtils.addColumn('is_head_of_decentralized_cafes', {
    type: DataTypes.TINYINT,
    defaultValue: null,
  });

  await columnUtils.addColumn('cafe_number', {
    type: DataTypes.TEXT('medium'),
    defaultValue: null,
  });

  await columnUtils.addColumn('schoox_above_id', {
    type: DataTypes.CHAR(255),
    defaultValue: null,
  });

  await columnUtils.addColumn('created', {
    type: DataTypes.DATE(6),
    defaultValue: null,
  });

  await columnUtils.addColumn('completed', {
    type: DataTypes.DATE(6),
    defaultValue: null,
  });

  await columnUtils.addColumn('changed', {
    type: DataTypes.DATE(6),
    defaultValue: null,
  });

  await columnUtils.addColumn('in_draft', {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  });

  await columnUtils.addColumn('is_deactivated', {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  });

  await columnUtils.addColumn('employment_status', {
    type: DataTypes.CHAR(45),
    defaultValue: null,
  });
};

export const down: MigrationFn<QueryInterface> = async ({
  context: queryInterface,
}) => {
  const columnUtils = new ColumnUtils(queryInterface, 'users');

  await columnUtils.renameColumn('firstname', 'firstName');
  await columnUtils.changeColumn('firstName', {
    type: DataTypes.STRING,
    allowNull: true,
  });

  await columnUtils.renameColumn('lastname', 'lastName');
  await columnUtils.changeColumn('lastName', {
    type: DataTypes.STRING,
    allowNull: true,
  });

  await columnUtils.changeColumn('email', {
    type: DataTypes.STRING,
    allowNull: true,
  });

  await columnUtils.changeColumn('password', {
    type: DataTypes.STRING,
    allowNull: true,
  });

  await columnUtils.removeColumn('schoox_id');
  await columnUtils.removeColumn('email_original');
  await columnUtils.removeColumn('email_validation_outcome');
  await columnUtils.removeColumn('langcode');
  await columnUtils.removeColumn('role');
  await columnUtils.removeColumn('roles');
  await columnUtils.removeColumn('decentralized_cafes');
  await columnUtils.removeColumn('is_head_of_decentralized_cafes');
  await columnUtils.removeColumn('cafe_number');
  await columnUtils.removeColumn('schoox_above_id');
  await columnUtils.removeColumn('created');
  await columnUtils.removeColumn('completed');
  await columnUtils.removeColumn('changed');
  await columnUtils.removeColumn('in_draft');
  await columnUtils.removeColumn('is_deactivated');
  await columnUtils.removeColumn('employment_status');
};

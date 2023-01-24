import { DataTypes, QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({
  context: queryInterface,
}) => {
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
  });

  await queryInterface.createTable('user_tokens', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING,
    },
    expiration: {
      type: DataTypes.DATE,
    },
  });
};

export const down: MigrationFn<QueryInterface> = async ({
  context: queryInterface,
}) => {
  await queryInterface.dropTable('users');
  await queryInterface.dropTable('user_tokens');
};

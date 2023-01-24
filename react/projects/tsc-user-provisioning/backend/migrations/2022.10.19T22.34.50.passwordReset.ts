import { DataTypes, QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({
  context: queryInterface,
}) => {
  await queryInterface.createTable('password_reset_tokens', {
    user_id: {
      type: DataTypes.CHAR(255),
    },
    token: {
      type: DataTypes.CHAR(65),
    },
    expiration: {
      type: DataTypes.DATE(6),
    },
  });
};

export const down: MigrationFn<QueryInterface> = async ({
  context: queryInterface,
}) => {
  await queryInterface.dropTable('password_reset_tokens');
};

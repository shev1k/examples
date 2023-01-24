import { DataTypes, QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

import { ColumnUtils } from './utils';

export const up: MigrationFn<QueryInterface> = async ({
  context: queryInterface,
}) => {
  const columnUtils = new ColumnUtils(queryInterface, 'user_tokens');

  await columnUtils.removeColumn('type');
};

export const down: MigrationFn<QueryInterface> = async ({
  context: queryInterface,
}) => {
  const columnUtils = new ColumnUtils(queryInterface, 'user_tokens');

  await columnUtils.addColumn('type', {
    type: DataTypes.STRING,
  });
};

import { QueryInterface, ModelAttributeColumnOptions, TableName } from 'sequelize';

class ColumnUtils {
  private queryInterface: QueryInterface;
  private tableName: TableName;

  constructor(queryInterface: QueryInterface, tableName: TableName) {
    this.queryInterface = queryInterface;
    this.tableName = tableName;
  }

  public async addColumn(column: string, options: ModelAttributeColumnOptions) {
    return await this.queryInterface.addColumn(this.tableName, column, options);
  }

  public async changeColumn(
    columnName: string,
    options?: ModelAttributeColumnOptions,
  ) {
    return await this.queryInterface.changeColumn(
      this.tableName,
      columnName,
      options,
    );
  }

  public async removeColumn(column: string) {
    return await this.queryInterface.removeColumn(this.tableName, column);
  }

  public async renameColumn(nameBefore: string, nameAfter: string) {
    return await this.queryInterface.renameColumn(
      this.tableName,
      nameBefore,
      nameAfter,
    );
  }
}

export default ColumnUtils;

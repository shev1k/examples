import './_init';
import { Umzug, SequelizeStorage } from 'umzug';
import { Database } from '../src/models';

const { sequelize } = new Database();

const umzug = new Umzug({
  migrations: { glob: 'migrations/*.ts' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

exports.umzug = umzug;

if (require.main === module) {
  umzug.runAsCLI();
}

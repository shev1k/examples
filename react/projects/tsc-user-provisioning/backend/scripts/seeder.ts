import './_init';
import { Command } from 'commander';
import path from 'path';
import fs from 'fs';

import { Database } from '../src/models';

type ModelKeys = keyof Omit<Database, 'sequelize'>;

const SEEDS_PATH = path.resolve(__dirname, '../seeds');

const program = new Command();

program.name('seeder');

program
  .option('-a, --all', 'Apply all seeds')
  .option('-n, --name <fileName>', 'Aplly seed from a single file')
  .option('-d, --drop', 'Drop seeds')
  .action(async ({ all, name, drop }) => {
    const db = new Database();

    if (all && name) {
      console.error('Use only one option');
      return process.exit(1);
    }

    if (!all && !name) {
      console.error('At least one option is required');
      return process.exit(1);
    }

    if (all) {
      if (drop) {
        await dropAllSeeds(db);
      } else {
        await applyAllSeeds(db);
      }
    }

    if (name) {
      if (drop) {
        await drop(db, name);
      } else {
        await seed(db, name);
      }
    }

    console.log('Seeding complete');
    process.exit(0);
  });

const getSeedFileNames = () => fs.readdirSync(SEEDS_PATH);

const getSeedConfig = async (fileName: string) => {
  const {
    config: { modelName, data },
  } = await import(`${SEEDS_PATH}/${fileName}`);
  return { modelName, data };
};

const dropAllSeeds = async (db: Database) => {
  const seedFileNames = getSeedFileNames();

  for (const seedFileName of seedFileNames) {
    await drop(db, seedFileName);
  }
};

const drop = async (db: Database, fileName: string) => {
  const { modelName } = await getSeedConfig(fileName);
  const model = db[modelName as ModelKeys];

  console.log('\n--------------------------------------------------------');
  console.log(`\nTable: ${model.tableName}`);
  console.log(`\nSeed: ${fileName}`);
  console.log('\nClearing rows');
  // @ts-ignore
  await model.destroy({
    where: {},
    truncate: true,
  });

  console.log('Drop complete for', model.tableName, '\n');
  console.log('--------------------------------------------------------');
};

const seed = async (db: Database, fileName: string) => {
  const { modelName, data } = await getSeedConfig(fileName);
  const model = db[modelName as ModelKeys];

  console.log('\n--------------------------------------------------------');
  console.log(`\nTable: ${model.tableName}`);
  console.log(`\nSeed: ${fileName}`);
  console.log('\nInserting data');
  // @ts-ignore
  await model.bulkCreate(data);

  console.log('\nSeed complete for', model.tableName, '\n');
  console.log('--------------------------------------------------------');
};

const applyAllSeeds = async (db: Database) => {
  const seedFileNames = getSeedFileNames();

  for (const seedFileName of seedFileNames) {
    await seed(db, seedFileName);
  }
};

program.parse();

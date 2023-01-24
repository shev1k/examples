import { Sequelize } from 'sequelize';

import userModel from './user.model';
import userTokenModel from './user-token.model';
import passwordResetTokenModel from './password-reset.model';

export class Database {
  public sequelize: Sequelize;
  public User: ReturnType<typeof userModel>;
  public UserToken: ReturnType<typeof userTokenModel>;
  public PasswordResetToken: ReturnType<typeof passwordResetTokenModel>;

  constructor() {
    const sequelize = this.connect();

    this.User = userModel(sequelize);
    this.UserToken = userTokenModel(sequelize);
    this.PasswordResetToken = passwordResetTokenModel(sequelize);

    this.sequelize = sequelize;
  }

  private connect() {
    return new Sequelize(
      String(process.env.DATABASE_NAME),
      String(process.env.DATABASE_USER),
      String(process.env.DATABASE_PASSWORD),
      {
        host: String(process.env.DATABASE_HOST),
        dialect: 'mysql',
        logging: console.log,
        define: {
          timestamps: false,
        },
        pool: {
          max: Number(process.env.DATABASE_POOL_MAX),
          min: Number(process.env.DATABASE_POOL_MIN),
          acquire: Number(process.env.DATABASE_POOL_ACQUIRE),
          idle: Number(process.env.DATABASE_POOL_IDL),
        },
      },
    );
  }
}

const { User, UserToken, PasswordResetToken } = new Database();

export { User, UserToken, PasswordResetToken };

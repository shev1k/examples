import jwt from 'jsonwebtoken';

import { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from '@/configs/jwt.config';
import { AccountType } from '@/enums';
import { UserToken } from '@/models';
import { IUserDto } from '@/dtos/user.dto';
import { getAccountType } from '@/utils';

interface ITokenValues {
  uuid: IUserDto['uuid'];
  role: IUserDto['role'];
}

class UserTokenService {
  public async getToken(token: string) {
    const found = await UserToken.findOne({
      where: {
        token,
      },
    });

    return found?.get();
  }

  public async saveToken(token: string, expiration: Date) {
    const created = await UserToken.create({
      token,
      expiration,
    });

    return created.get();
  }

  public async removeToken(token: string) {
    const found = await UserToken.findOne({
      where: {
        token,
      },
    });

    return await found?.destroy();
  }

  public decodeToken(token: string) {
    const { uuid, role } = jwt.decode(token) as ITokenValues;
    const accountType = getAccountType(role);

    return { uuid, role, accountType } as ITokenValues & {
      accountType: AccountType;
    };
  }

  public generateAccessToken(values: ITokenValues) {
    return this.generateToken(
      values,
      process.env.JWT_ACCESS_SECRET,
      ACCESS_TOKEN_EXPIRATION,
    );
  }

  public generateRefreshToken(values: ITokenValues) {
    return this.generateToken(
      values,
      process.env.JWT_REFRESH_SECRET,
      REFRESH_TOKEN_EXPIRATION,
    );
  }

  public async validate(token: string, secret?: string) {
    if (secret) {
      try {
        jwt.verify(token, secret);
      } catch (error) {
        return false;
      }
    }

    const userToken = await this.getToken(token);
    if (!userToken) return false;

    return Number(userToken.expiration) < Date.now() * 1000;
  }

  private generateToken(
    values: Pick<IUserDto, 'role' | 'uuid'>,
    secret: string,
    expiresIn: number,
  ) {
    const tokenOptions = { expiresIn };
    return jwt.sign(values, secret, tokenOptions);
  }
}

export default UserTokenService;

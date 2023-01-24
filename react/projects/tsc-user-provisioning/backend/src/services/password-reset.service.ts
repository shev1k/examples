import crypto from 'crypto';

import { PasswordResetToken } from '@/models';
import { getUTC } from '@/utils';
import { RESET_PASSWORD_TOKEN_EXPIRATION } from '@/configs/mail.config';
import { IPasswordResetDto } from '@/dtos/password-reset.dto';

class PasswordResetService {
  public async getToken(token: string): Promise<IPasswordResetDto | null> {
    const found = await PasswordResetToken.findOne({
      where: {
        token,
      },
    });

    return found?.get();
  }

  public async saveToken(uuid: string, token: string) {
    return (
      await PasswordResetToken.create({
        user_id: uuid,
        expiration: getUTC(new Date(), RESET_PASSWORD_TOKEN_EXPIRATION),
        token,
      })
    ).get();
  }

  public async removeToken(token: string) {
    const found = await PasswordResetToken.findOne({
      where: {
        token,
      },
    });

    return await found?.destroy();
  }

  public generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  public validate(_token: string, expiration: Date) {
    return Number(expiration) < Date.now() * 1000;
  }
}

export default PasswordResetService;

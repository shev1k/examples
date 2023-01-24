import { IResponseBody } from 'interfaces';
import { cookieService, userService } from 'services';
import client from 'configs/client';
import { ICurrentUser } from 'modules/Auth/interfaces';

export interface ILoginResponseBody {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

class AuthService {
  public async login(email: string, password: string): Promise<void> {
    const {
      data: { accessToken, expiresIn, refreshToken },
    } = await client.post<IResponseBody<ILoginResponseBody>>('/auth/login', {
      email,
      password,
    });
    cookieService.setAuthCookie({ accessToken, refreshToken, expiresIn });
    return Promise.resolve();
  }

  public async logout() {
    const { refreshToken } = cookieService.getTokens();
    await client.delete(`/auth/logout?refreshToken=${refreshToken}`);
    cookieService.deleteAuthCookies();
  }

  public getCurrentUser = async (): Promise<ICurrentUser> => {
    const { data } = await client.get('/auth/me');
    return this.formatOnLogin({ user: data });
  };

  public async forgotPassword(email: string) {
    const { data } = await client.post('/auth/forgotPassword', { email });
    return data;
  }

  public async updatePassword(password, passwordConfirmation, token) {
    const { data } = await client.put('/auth/updatePassword', {
      password,
      passwordConfirmation,
      token,
    });
    return data;
  }

  private formatOnLogin({
    user: { cafe_number, decentralized_cafes, ...user },
  }: {
    user: ICurrentUser & { cafe_number?: string; decentralized_cafes?: string };
  }): ICurrentUser {
    const accountType = userService.getAccountType(user.role);
    const cafeNumbers = cafe_number ? cafe_number.split(',') : [];
    const decentralizedCafes = decentralized_cafes
      ? decentralized_cafes.split(',')
      : [];

    return {
      ...user,
      accountType,
      cafeNumbers,
      decentralizedCafes,
    };
  }
}

const authService = new AuthService();

export default authService;

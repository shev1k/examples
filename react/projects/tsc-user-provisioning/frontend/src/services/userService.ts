import client from 'configs/client';
import { AdminRole, AccountType, UserRole, SupportRole } from 'enums';

class UserService {
  public async fetchUser({ userId }: { userId: string }) {
    const { data } = await client.get(`/users/${userId}`);
    return data;
  }

  public getAccountType(
    role: keyof typeof UserRole | SupportRole | AdminRole,
  ): AccountType {
    if (role in UserRole) {
      return AccountType.user;
    }
    if (role in SupportRole) {
      return AccountType.support;
    }
    if (role in AdminRole) {
      return AccountType.admin;
    }

    // if (process.env.NODE_ENV === 'development') {
    //   return AccountType.admin;
    // }
  }
}

const userService = new UserService();

export default userService;

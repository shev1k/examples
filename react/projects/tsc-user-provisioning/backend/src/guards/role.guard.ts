import { Request, Response, NextFunction } from 'express';

import { AccountType } from '@/enums';

const roleGuard =
  (allowedAccountTypes: AccountType[]) =>
  async (request: Request, response: Response, next: NextFunction) => {
    if (!allowedAccountTypes.includes(request?.user.accountType)) {
      return response.sendStatus(403);
    }

    next();
  };

export default roleGuard;

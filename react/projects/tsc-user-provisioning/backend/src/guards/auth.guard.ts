import { Request, Response, NextFunction } from 'express';

import { UserTokenService } from '@/services';
import { getTokenFromHeader } from '@/utils';

const tokenService = new UserTokenService();

const authGuard = async (request: Request, response: Response, next: NextFunction) => {
  const token = getTokenFromHeader(request);

  if (!token) {
    return response.status(401).json({
      errors: {
        message: "No 'authorization' header provided",
      },
    });
  }

  if (request.url === '/api/auth/refresh') {
    next();
  }

  const isTokenValid = await tokenService.validate(token, process.env.JWT_ACCESS_SECRET);

  if (isTokenValid) {
    request.user = tokenService.decodeToken(token);
    next();
  } else {
    await tokenService.removeToken(token);

    return response.status(401).json({
      errors: {
        message: 'Token expired',
      },
    });
  }
};

export default authGuard;

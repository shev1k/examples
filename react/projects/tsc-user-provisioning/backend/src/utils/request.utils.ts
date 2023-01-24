import { Request } from 'express';

export const getTokenFromHeader = (request: Request<any, any, any, any>) => {
  const { authorization } = request.headers;
  if (!authorization) return null;

  const token = authorization.split(' ')[1];
  if (!token) return null;

  return token;
};

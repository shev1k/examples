import { TypedRequest } from './common';

export interface ILoginRequest
  extends TypedRequest<{ email: string; password: string }> {}

export interface ILogoutRequest extends TypedRequest<{ refreshToken: string }> {}

export interface IRegisterRequest
  extends TypedRequest<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    langcode?: string;
  }> {}

export interface IRefreshTokenRequest extends TypedRequest<{ refreshToken: string }> {}

export interface IUpdatePasswordRequest
  extends TypedRequest<{
    password: string;
    passwordConfirmation: string;
    token: string;
  }> {}

export interface IForgotPasswordRequest extends TypedRequest<{ email: string }> {}

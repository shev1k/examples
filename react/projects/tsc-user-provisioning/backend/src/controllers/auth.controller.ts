import { Request, Response } from 'express';
import * as R from 'ramda';

import { getTokenFromHeader, getUTC } from '@/utils';
import {
  MailService,
  UserService,
  UserTokenService,
  PasswordResetService,
} from '@/services';
import { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from '@/configs/jwt.config';
import {
  ILoginRequest,
  ILogoutRequest,
  IRegisterRequest,
  IRefreshTokenRequest,
  IUpdatePasswordRequest,
  IForgotPasswordRequest,
} from '@/interfaces/auth';

export default class AuthController {
  private mailService: MailService;
  private userService: UserService;
  private userTokenService: UserTokenService;
  private passwordResetService: PasswordResetService;

  constructor() {
    this.mailService = new MailService();
    this.userService = new UserService();
    this.userTokenService = new UserTokenService();
    this.passwordResetService = new PasswordResetService();
  }

  public login = async (request: ILoginRequest, response: Response) => {
    const { email, password } = request.body;

    try {
      const user = await this.userService.getUserByEmail(email);
      if (!user)
        return response.status(400).json({ errors: { message: 'Email not found' } });

      if (!(await this.userService.validatePassword(password, user.password)))
        return response.status(401).json({
          errors: {
            message: 'Invalid password',
          },
        });

      const accessToken = await this.userTokenService.generateAccessToken(
        R.pick(['role', 'uuid'], user),
      );
      const refreshToken = await this.userTokenService.generateRefreshToken(
        R.pick(['role', 'uuid'], user),
      );

      await Promise.all([
        this.userTokenService.saveToken(
          accessToken,
          getUTC(new Date(), ACCESS_TOKEN_EXPIRATION),
        ),
        this.userTokenService.saveToken(
          refreshToken,
          getUTC(new Date(), REFRESH_TOKEN_EXPIRATION),
        ),
      ]);

      return response.status(200).json({
        data: {
          accessToken,
          refreshToken,
          expiresIn: ACCESS_TOKEN_EXPIRATION,
        },
      });
    } catch (error) {
      response.status(500).json({
        errors: {
          message: (error as Error).message,
        },
      });
    }
  };

  public logout = async (request: ILogoutRequest, response: Response) => {
    const accessToken = getTokenFromHeader(request);
    const { refreshToken } = request.query;

    try {
      await Promise.all([
        this.userTokenService.removeToken(accessToken),
        this.userTokenService.removeToken(refreshToken as string),
      ]);
      return response.sendStatus(200);
    } catch (error) {
      return response.status(500).json({ errors: { message: (error as Error).message } });
    }
  };

  public register = async (request: IRegisterRequest, response: Response) => {
    const { email, password, firstName, lastName, langcode = 'en-US' } = request.body;

    let user = await this.userService.getUserByEmail(email);
    if (user)
      return response
        .status(400)
        .json({ errors: { message: 'Email is already linked to an account' } });

    user = await this.userService.create({
      email,
      password,
      firstname: firstName,
      lastname: lastName,
      langcode,
    });

    return response.status(200).json({
      data: {
        user: R.omit(['password'], user),
      },
    });
  };

  public me = async (request: Request, response: Response) => {
    const user = await this.userService.getUserByToken(request.headers.authorization);

    if (!user) response.status(400).json({ errors: { message: 'User not found' } });

    return response.status(200).json({
      data: R.omit(['password'], user),
    });
  };

  public refreshToken = async (request: IRefreshTokenRequest, response: Response) => {
    const { refreshToken } = request.body;

    if (!(await this.userTokenService.validate(refreshToken))) {
      await this.userTokenService.removeToken(refreshToken);
      return response.status(401).json({ errors: { message: 'Refresh token expired' } });
    }

    try {
      const { uuid, role } = this.userTokenService.decodeToken(refreshToken);
      const newAccessToken = this.userTokenService.generateAccessToken({
        uuid,
        role,
      });

      await this.userTokenService.saveToken(
        newAccessToken,
        getUTC(new Date(), ACCESS_TOKEN_EXPIRATION),
      );

      return response.status(200).json({
        data: {
          accessToken: newAccessToken,
          expiresIn: ACCESS_TOKEN_EXPIRATION,
        },
      });
    } catch (error) {
      return response.status(500).json({ errors: { message: (error as Error).message } });
    }
  };

  public forgotPassword = async (request: IForgotPasswordRequest, response: Response) => {
    const { email } = request.body;
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      return response.status(400).json({
        errors: {
          message: 'Email not found',
        },
      });
    }

    const token = this.passwordResetService.generateToken();

    try {
      await this.mailService.sendMail({
        to: user.email,
        subject: 'Password reset',
        text: `
          Password reset link: ${request.hostname}/password-reset?token=${token}
          Link will expire in one hour.
        `,
      });
      await this.passwordResetService.saveToken(user.uuid, token);

      return response.status(200).json({ data: null });
    } catch (err) {
      return response.status(500).json({
        errors: {
          message: (err as Error).message,
        },
      });
    }
  };

  public updatePassword = async (request: IUpdatePasswordRequest, response: Response) => {
    const { password, passwordConfirmation, token: resetToken } = request.body;

    if (password !== passwordConfirmation)
      return response
        .status(400)
        .json({ errors: { message: "Passwords doesn't match" } });

    const _tokenAttr = await this.passwordResetService.getToken(resetToken);

    if (!_tokenAttr) {
      return response.status(400).json({ errors: { message: 'Token expired' } });
    }

    const { expiration, token, user_id } = _tokenAttr;

    if (!this.passwordResetService.validate(token, expiration)) {
      await this.passwordResetService.removeToken(token);
      return response.status(400).json({ errors: { message: 'Token expired' } });
    }

    const hashedPassword = await this.userService.generatePasswordHash(password);

    try {
      await this.userService.updateById(user_id, {
        password: hashedPassword,
      });
      await this.passwordResetService.removeToken(token);

      return response.status(200).json({
        data: null,
      });
    } catch (error) {
      return response.status(500).json({ errors: { message: (error as Error).message } });
    }
  };
}

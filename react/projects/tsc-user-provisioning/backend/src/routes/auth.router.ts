import express from 'express';
import { body, query } from 'express-validator';

import { AuthController } from '@/controllers';
import { authGuard } from '@/guards';
import { validator } from '@/middlewares';

export default class AuthRouter {
  public router: express.Router;

  constructor() {
    const authController = new AuthController();

    this.router = express.Router();

    this.router.get('/me', authGuard, authController.me);

    this.router.post(
      '/login',
      body('email')
        .notEmpty()
        .withMessage('Email is missing')
        .isEmail()
        .withMessage('Email is invalid'),
      body('password').notEmpty().withMessage('Password is missing'),
      validator,
      authController.login,
    );

    // only for dev purposes
    if (process.env.NODE_ENV === 'development') {
      this.router.post(
        '/register',
        body('email').isEmail().notEmpty().withMessage('Email is missing'),
        body('password').notEmpty().withMessage('Password is missing'),
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
        validator,
        authController.register,
      );
    }

    this.router.post(
      '/forgotPassword',
      body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email is invalid'),
      authController.forgotPassword,
    );

    this.router.put('/refreshToken', body('refreshToken'), authController.refreshToken);

    this.router.put(
      '/updatePassword',
      body('password').notEmpty().withMessage('Password is required'),
      body('passwordConfirmation')
        .notEmpty()
        .withMessage('Password confirmation is required.'),
      body('token').notEmpty().withMessage('Reset password token is required'),
      authController.updatePassword,
    );

    this.router.delete(
      '/logout',
      authGuard,
      query('refreshToken'),
      authController.logout,
    );
  }
}

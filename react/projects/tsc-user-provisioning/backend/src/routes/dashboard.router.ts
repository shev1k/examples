import express from 'express';
import { body, query } from 'express-validator';

import { AccountType, AccountStatus } from '@/enums';
import { DashboardController } from '@/controllers';
import { authGuard, roleGuard } from '@/guards';
import { validator } from '@/middlewares';

export default class DashboardRouter {
  public router: express.Router;
  private controller: DashboardController;

  constructor() {
    this.controller = new DashboardController();
    this.router = express.Router();
    this.router.use(authGuard);
    this.router.use('/users', this.usersRouter());
    this.router.use('/supports', this.supportsRouter());
  }

  usersRouter = () => {
    const router = express.Router();
    router.use(roleGuard([AccountType.admin, AccountType.user]));

    router.get(
      '/',
      query('cafe_number[]').optional(),
      ...this.listMiddlewares(),
      this.controller.getUsers,
    );

    router.put(
      '/activate',
      body('uuid', 'uuid is required'),
      validator,
      this.controller.activateUser,
    );

    router.put(
      '/deactivate',
      body('uuid', 'uuid is required'),
      validator,
      this.controller.deactivateUser,
    );

    return router;
  };

  supportsRouter = () => {
    const router = express.Router();
    router.use(roleGuard([AccountType.admin]));

    router.get('/', ...this.listMiddlewares(), this.controller.getSupports);

    router.put(
      '/activate',
      body('uuid', 'uuid is required'),
      validator,
      this.controller.activateUser,
    );

    router.get('/learner-roles');

    router.put(
      '/deactivate',
      body('uuid', 'uuid is required'),
      validator,
      this.controller.deactivateUser,
    );

    return router;
  };

  private listMiddlewares() {
    return [
      query('account_status')
        .notEmpty()
        .withMessage('account_status is required')
        .custom(
          (status) =>
            status === AccountStatus.active || status === AccountStatus.deactivated,
        )
        .withMessage('account_status is invalid'),
      query(['role', 'firstname', 'lastname', 'email']).optional(),
      query(['page', 'pageSize']).optional(),
      query(['field', 'order']).optional(),
    ];
  }
}

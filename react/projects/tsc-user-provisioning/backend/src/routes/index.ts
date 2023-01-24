import express from 'express';

import AuthRouter from './auth.router';
import DashboardRouter from './dashboard.router';

export default class Api {
  public router: express.Router;

  constructor() {
    const router = express.Router();
    const auth = new AuthRouter();
    const dashboard = new DashboardRouter();

    router.use('/auth', auth.router);
    router.use('/dashboard', dashboard.router);
    this.router = router;
  }
}

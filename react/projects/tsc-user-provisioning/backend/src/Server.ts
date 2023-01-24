import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import Api from '@/routes';

const PORT = process.env.NODE_PORT || 8000;

export default class Server {
  public app: express.Application;

  constructor() {
    const app = express();
    const api = new Api();

    app.use(cors());
    app.use(cookieParser());
    app.use(express.json());
    app.use('/api', api.router);

    this.app = app;
  }

  public listen(): void {
    this.app.listen(PORT, () => console.log(`Server is listening at ${PORT}`));
  }
}

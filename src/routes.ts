import express, { Request, Response, NextFunction } from 'express';
import user from './api/user/index';
import response from './middleware/response';
import authenticate from './middleware/authenticate';

const middleware = [response, authenticate];

const Router = express.Router();

Router.get(
  '/health-check',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ status: 'ok' });
    } catch (e) {
      next(e);
    }
  }
);

Router.use('/user', middleware, user);

export default Router;

import express from 'express';
import controllers from './controllers';
import { body } from 'express-validator';

const routes = express.Router();

routes.post(
  '/login',
  [
    body('email').trim().isEmail(),
    body('password').trim().isLength({ min: 6 }),
  ],
  controllers.login
);

routes.post(
  '/register',
  [
    body('firstName').trim().not().isEmpty(),
    body('lastName').trim().not().isEmpty(),
    body('email').trim().isEmail(),
    body('password').trim().isLength({ min: 6 }),
  ],
  controllers.register
);

routes.post(
  '/forgotPassword',
  [body('email').trim().isEmail()],
  controllers.forgotPassword
);

routes.put(
  '/setNewPassword',
  [body('token').trim().not().isEmpty()],
  [body('password').trim().isLength({ min: 6 })],
  [body('repeatPassword').trim().isLength({ min: 6 })],
  controllers.setNewPassword
);

routes.get('/profile', controllers.profile);

export default routes;

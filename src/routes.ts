import express from 'express';
// import { response, authenticate } from '../middleware';

const Router = express.Router();
// const middleware = [response, authenticate];

Router.get('/health-check', (req, res, next) => {
  try {
    res.json({ status: 'ok' });
  } catch (e) {
    next(e);
  }
});

export default Router;

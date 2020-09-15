import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import httpStatus from 'http-status';
import { DATA_INVALID } from '../../constants/general';
import APIError from '../../utils/apiError';
import authService from './services/auth';
import profileService from './services/profile';

const controllers = {
  login: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new APIError(DATA_INVALID, httpStatus.BAD_REQUEST));
      }
      const payload = {
        ...req.body,
      };
      const result = await authService.login(payload);
      return res.success(result);
    } catch (err) {
      return next(err);
    }
  },
  register: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new APIError(DATA_INVALID, httpStatus.BAD_REQUEST));
      }
      const payload = {
        ...req.body,
      };
      await authService.register(payload);
      return res.success();
    } catch (error) {
      return next(error);
    }
  },
  forgotPassword: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new APIError(DATA_INVALID, httpStatus.BAD_REQUEST));
      }
      const payload = {
        ...req.body,
      };
      await authService.forgotPassword(payload);
      return res.success();
    } catch (error) {
      return next(error);
    }
  },
  setNewPassword: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new APIError(DATA_INVALID, httpStatus.BAD_REQUEST));
      }
      const payload = {
        ...req.body,
      };
      await authService.setNewPassword(payload);
      return res.success();
    } catch (error) {
      return next(error);
    }
  },
  profile: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = await profileService.profile({
        userId: req.userId,
      });
      return res.success(user);
    } catch (error) {
      return next(error);
    }
  },
};

export default controllers;

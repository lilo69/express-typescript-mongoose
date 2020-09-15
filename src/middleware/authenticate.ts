import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AUTHORIZATION_HEADER_REQUIRED } from '../constants/auth';
import APIError from '../utils/apiError';
import Token from '../utils/token';

async function auth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const path = req.path;
    if (
      ['/login', '/register', '/forgotPassword', '/setNewPassword'].includes(
        path
      )
    ) {
      return next();
    }
    const authorization = req.headers['authorization'];
    if (!authorization) {
      throw new APIError(
        AUTHORIZATION_HEADER_REQUIRED,
        httpStatus.UNAUTHORIZED
      );
    }
    const token = new Token(authorization);
    await token.verifyToken();
    req.userId = token.tokenDecoded.userId;
    return next();
  } catch (error) {
    return next(error);
  }
}

export default auth;

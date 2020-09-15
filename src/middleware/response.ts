import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { SUCCESS } from '../constants/general';

function response(req: Request, res: Response, next: NextFunction): void {
  res.success = (data: unknown = null) => {
    return res
      .status(httpStatus.OK)
      .json({ data: data, message: SUCCESS, success: true });
  };
  next();
}

export default response;

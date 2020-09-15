import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from './apiError';
import {
  GENERATE_TOKEN_ERROR,
  JSON_WEB_TOKEN_ERROR,
  TOKEN_EXPIRED,
} from '../constants/token';
import { ERROR } from '../constants/general';

const JWT_SECRET = process.env['JWT_SECRET'];

type PayloadType = {
  userId: string;
  userType: string;
};

class Token {
  private _token: string;
  private _tokenDecoded: PayloadType;
  get token(): string {
    return this._token;
  }

  set token(newToken: string) {
    this._token = newToken;
  }

  get tokenDecoded(): PayloadType {
    return this._tokenDecoded;
  }

  constructor(newToken: string = null) {
    this._token = newToken;
  }
  generateToken = async (
    payload: PayloadType,
    expiresIn: string = '7d'
  ): Promise<void> => {
    try {
      this._token = await jwt.sign(payload, JWT_SECRET, { expiresIn });
    } catch (error) {
      throw new APIError(
        GENERATE_TOKEN_ERROR,
        httpStatus.INTERNAL_SERVER_ERROR,
        error
      );
    }
  };

  verifyToken = async (): Promise<void> => {
    try {
      this._tokenDecoded = await (<PayloadType>(
        jwt.verify(this._token, JWT_SECRET)
      ));
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new APIError(TOKEN_EXPIRED, httpStatus.UNAUTHORIZED);
      } else if (error.name === 'JsonWebTokenError') {
        throw new APIError(JSON_WEB_TOKEN_ERROR, httpStatus.BAD_REQUEST, error);
      }
      throw new APIError(ERROR, httpStatus.INTERNAL_SERVER_ERROR, error);
    }
  };
}

export default Token;

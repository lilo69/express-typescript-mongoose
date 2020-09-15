import User from '../model';
import Token from '../../../utils/token';
import httpStatus from 'http-status';
import APIError from '../../../utils/apiError';
import sendEmail from '../../../utils/email';
import mongoose from 'mongoose';
import {
  EMAIL_OR_PASSWORD_NOT_RIGHT,
  EMAIL_NOT_EXIST,
  PASSWORD_DIFFERENT_REPEAT_PASSWORD,
  USER_NOT_EXIST,
  EMAIL_EXISTED,
} from '../../../constants/auth';

const ObjectId = mongoose.Types.ObjectId;

const login = async (payload: {
  email: string;
  password: string;
}): Promise<
  | {
      accessToken: string;
      user: {
        avatar: string;
        fullName: string;
      };
    }
  | Error
> => {
  try {
    const { email, password } = payload;
    const user = await User.findOne({ email });
    if (!user) {
      throw new APIError(EMAIL_OR_PASSWORD_NOT_RIGHT, httpStatus.BAD_REQUEST);
    }
    if (!user.comparePassword(password)) {
      throw new APIError(EMAIL_OR_PASSWORD_NOT_RIGHT, httpStatus.BAD_REQUEST);
    }
    const token = new Token();
    await token.generateToken({
      userId: user.id,
      userType: user.type,
    });
    return {
      accessToken: token.token,
      user: {
        avatar: user.avatar,
        fullName: user.fullName,
      },
    };
  } catch (error) {
    throw error;
  }
};

const register = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
}): Promise<Error> => {
  try {
    const { firstName, lastName, email, password, avatar } = payload;
    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new APIError(EMAIL_EXISTED, httpStatus.BAD_REQUEST);
    }
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      avatar,
    });
    await user.save();
    return null;
  } catch (error) {
    throw error;
  }
};

const forgotPassword = async (payload: { email: string }): Promise<Error> => {
  try {
    const { email } = payload;
    const user = await User.findOne({ email });
    if (!user) {
      throw new APIError(EMAIL_NOT_EXIST, httpStatus.BAD_REQUEST);
    }
    const token = new Token();
    await token.generateToken(
      {
        userId: user.id,
        userType: user.type,
      },
      '15m'
    );
    await sendEmail({
      email,
      subject: 'Thay đổi mật khẩu',
      text: `${process.env.feHost}/password/set-new-password?token=${token.token}`,
    });
    return null;
  } catch (error) {
    throw error;
  }
};

const setNewPassword = async (payload: {
  token: string;
  password: string;
  repeatPassword: string;
}): Promise<Error> => {
  try {
    const { token, password, repeatPassword } = payload;
    if (password !== repeatPassword) {
      throw new APIError(
        PASSWORD_DIFFERENT_REPEAT_PASSWORD,
        httpStatus.BAD_REQUEST
      );
    }
    const tokenClass = new Token();
    tokenClass.token = token;
    await tokenClass.verifyToken();
    const tokenDecoded = tokenClass.tokenDecoded;
    const user = await User.findOne({
      _id: new ObjectId(tokenDecoded.userId),
    });
    if (!user) {
      throw new APIError(USER_NOT_EXIST, httpStatus.BAD_REQUEST);
    }
    user.password = password;
    await user.save();
    return null;
  } catch (error) {
    throw error;
  }
};

export default {
  login,
  register,
  forgotPassword,
  setNewPassword,
};

import mongoose from 'mongoose';
import User from '../model';

const ObjectId = mongoose.Types.ObjectId;

const profile = async (payload: {
  userId: string;
}): Promise<
  | {
      avatar: string;
      fullName: string;
      lastName: string;
      firstName: string;
      type: string;
    }
  | Error
> => {
  const { userId } = payload;
  try {
    const user = await User.findOne({
      _id: new ObjectId(userId),
    });
    return {
      avatar: user.avatar,
      fullName: user.fullName,
      lastName: user.lastName,
      firstName: user.firstName,
      type: user.type,
    };
  } catch (error) {
    throw error;
  }
};

export default {
  profile,
};

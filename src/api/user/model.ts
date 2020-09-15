import bcrypt from 'bcrypt-nodejs';
import mongoose from 'mongoose';
import { USER_TYPE } from '../../constants/user';

const Schema = mongoose.Schema;

export interface IUserSchema extends mongoose.Document {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  avatar: string;
  type: string;
  fullName: string;
  comparePassword(password: string): boolean;
}

const UserSchema = new Schema(
  {
    email: { type: String, unique: true },
    password: String,
    lastName: String,
    firstName: String,
    fullName: String,
    avatar: String,
    type: {
      type: String,
      default: USER_TYPE,
    },
  },
  { timestamps: true }
);

const generatePassword = function (password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

const comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.pre<IUserSchema>('save', function (next) {
  if (this.password) this.password = generatePassword(this.password);
  this.fullName = this.firstName + ' ' + this.lastName;
  next();
});

UserSchema.methods.comparePassword = comparePassword;

export default mongoose.model<IUserSchema>('User', UserSchema);

import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { USER_ROLES } from '../constants/enums.js';
import { UserModel } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { signToken } from '../utils/token.js';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  city: string;
  phone?: string;
  role?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async register(input: RegisterInput) {
    const existingUser = await UserModel.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email is already registered');
    }

    const role =
      input.role === USER_ROLES.OWNER ? USER_ROLES.OWNER : USER_ROLES.USER;

    const password = await bcrypt.hash(input.password, 12);

    const user = await UserModel.create({
      ...input,
      email: input.email.toLowerCase(),
      password,
      role
    });

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.city,
        phone: user.phone,
        role: user.role
      }
    };
  },

  async login(input: LoginInput) {
    const user = await UserModel.findOne({ email: input.email.toLowerCase() });
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.password);
    if (!passwordMatches) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.city,
        phone: user.phone,
        role: user.role
      }
    };
  },

  async getProfile(userId: string) {
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    return user;
  }
};


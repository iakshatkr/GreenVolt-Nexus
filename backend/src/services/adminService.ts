import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../models/User.js';
import { ChargingStationModel } from '../models/ChargingStation.js';
import { ApiError } from '../utils/apiError.js';

export const adminService = {
  async users() {
    return UserModel.find().select('-password').sort({ createdAt: -1 });
  },

  async stations() {
    return ChargingStationModel.find().populate('owner', 'name email city').sort({ createdAt: -1 });
  },

  async deleteUser(userId: string) {
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    return { message: 'User deleted successfully' };
  }
};

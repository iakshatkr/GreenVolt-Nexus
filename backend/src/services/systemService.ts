import { BookingModel } from '../models/Booking.js';
import { ChargingStationModel } from '../models/ChargingStation.js';
import { PaymentModel } from '../models/Payment.js';
import { UserModel } from '../models/User.js';
import { env } from '../config/env.js';
import { getDatabaseStatus } from '../config/database.js';

export const systemService = {
  async integrationStatus() {
    const [users, stations, bookings, payments] = await Promise.all([
      UserModel.countDocuments(),
      ChargingStationModel.countDocuments(),
      BookingModel.countDocuments(),
      PaymentModel.countDocuments()
    ]);

    return {
      frontendOrigin: env.CLIENT_URL,
      api: {
        status: 'online'
      },
      database: {
        ...getDatabaseStatus(),
        collections: {
          users,
          stations,
          bookings,
          payments
        }
      }
    };
  }
};
